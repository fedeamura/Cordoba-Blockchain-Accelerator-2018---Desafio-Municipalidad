import _ from "lodash";
import {
  NEMLibrary,
  NetworkTypes,
  TransactionHttp,
  Account,
  XEM,
  TransferTransaction,
  TimeWindow,
  Address,
  PlainMessage,
  EmptyMessage,
  AssetHttp,
  AssetId,
  SimpleWallet,
  Password
} from "nem-library";
import * as firebase from "firebase";

import Rules_Account from "@Rules/Rules_Account";
import Rules_IPFS from "@Rules/Rules_IPFS";

const ADMIN_PRIVATE_KEY =
  '"a96c00a512be561230028ab99d04c5ee8848e586e7a1050425cf5c8056d55306';

const metodos = {
  getByUsuario: idUsuarioCreador => {
    return new Promise((resolve, reject) => {
      var db = firebase.firestore();

      console.log(idUsuarioCreador);

      db.collection("reclamo")
        .where("idUsuarioCreador", "==", idUsuarioCreador)
        .get()
        .then(docs => {
          docs = docs.docs;
          let reclamos = [];
          docs.forEach(x => {
            reclamos.push(x.data());
          });

          let grupos = _.groupBy(reclamos, "numero");

          let resultado = [];

          for (var x in grupos) {
            if (grupos.hasOwnProperty(x)) {
              resultado.push(_.reverse(_.orderBy(grupos[x], "fecha"))[0]);
            }
          }
          resolve(resultado);
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  },
  get: () => {
    return new Promise((resolve, reject) => {
      var db = firebase.firestore();

      db.collection("reclamo")
        .get()
        .then(docs => {
          docs = docs.docs;
          let reclamos = [];
          docs.forEach(x => {
            reclamos.push(x.data());
          });

          let grupos = _.groupBy(reclamos, "numero");

          let resultado = [];

          for (var x in grupos) {
            if (grupos.hasOwnProperty(x)) {
              resultado.push(_.reverse(_.orderBy(grupos[x], "fecha"))[0]);
            }
          }
          resolve(resultado);
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  },
  getById: id => {
    return new Promise((resolve, reject) => {
      var db = firebase.firestore();

      db.collection("reclamo")
        .doc(id)
        .get()
        .then(docs => {
          resolve(docs.data());
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  },
  getByNumero: numero => {
    return new Promise((resolve, reject) => {
      var db = firebase.firestore();

      db.collection("reclamo")
        .where("numero", "==", parseInt(numero))
        .get()
        .then(docs => {
          docs = docs.docs;
          let reclamos = [];
          docs.forEach(x => {
            reclamos.push(x.data());
          });

          reclamos = _.reverse(_.orderBy(reclamos, "fecha"));
          resolve(reclamos);
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  },
  crear: comando => {
    return new Promise((resolve, reject) => {
      let {
        tipo,
        subtipo,
        empresa,
        descripcion,
        idUsuarioCreador,
        nombreUsuarioCreador,
        apellidoUsuarioCreador,
        privateKey
      } = comando;
      if (tipo.trim() === "") {
        reject("Ingrese el tipo");
        return;
      }

      if (subtipo.trim() === "") {
        reject("Ingrese el subtipo");
        return;
      }

      if (empresa.trim() === "") {
        reject("Ingrese la empresa");
        return;
      }

      if (descripcion.trim() === "") {
        reject("Ingrese la descripcion");
        return;
      }

      if (idUsuarioCreador.trim() === "") {
        reject("Ingrese el usuario creador");
        return;
      }
      if (nombreUsuarioCreador.trim() == "") {
        reject("Ingrese el usuario creador");
        return;
      }
      if (apellidoUsuarioCreador.trim() == "") {
        reject("Ingrese el usuario creador");
        return;
      }
      var db = firebase.firestore();

      db.collection("configuracion")
        .get()
        .then(docs => {
          let numero = 0;
          let id = undefined;
          if (docs.size == 0) {
            numero = 1;
          } else {
            id = docs.docs[0].id;
            numero = parseInt(docs.docs[0].data().numero) + 1;
          }

          if (id) {
            db.collection("configuracion")
              .doc(id)
              .update({ numero: numero });
          } else {
            id = db.collection("configuracion").doc().id;
            db.collection("configuracion")
              .doc(id)
              .set({ id: id, numero: numero });
          }
          Rules_Account.crear({
            nombre: "Reclamo Nº " + numero,
            password: "Reclamo" + numero
          })
            .then(({ account, wlt }) => {
              let id = db.collection("reclamo").doc().id;
              let reclamo = {
                id: id,
                estado: "Nuevo",
                observaciones: "",
                fechaAlta: new Date().getTime(),
                fecha: new Date().getTime(),
                numero: numero,
                tipo: tipo,
                subtipo: subtipo,
                empresa: empresa,
                descripcion: descripcion,
                idUsuarioCreador: idUsuarioCreador,
                nombreUsuarioCreador: nombreUsuarioCreador,
                apellidoUsuarioCreador: apellidoUsuarioCreador,
                account: {
                  address: account.address.value,
                  privateKey: account.privateKey,
                  publicKey: account.publicKey,
                  wlt: wlt
                }
              };

              Rules_IPFS.insertar({
                nombre: "Reclamo Nº " + reclamo.numero,
                contenido: JSON.stringify(reclamo)
              })
                .then(({ hash }) => {
                  reclamo.ipfsHash = hash;

                  Rules_Account.enviarMensaje({
                    privateKey: privateKey,
                    address: reclamo.account.address,
                    mensaje: hash
                  })
                    .then(data => {
                      reclamo.transactionHash = data.transactionHash.data;

                      db.collection("reclamo")
                        .doc(id)
                        .set(reclamo)
                        .then(() => {
                          resolve(reclamo);
                        })
                        .catch(({ message }) => {
                          reject(message);
                        });
                    })
                    .catch(error => {
                      reject(error);
                    });
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  },
  editar: comando => {
    return new Promise((resolve, reject) => {
      let {
        numero,
        estado,
        observaciones,
        privateKey,
        idUsuarioOperador,
        nombreUsuarioOperador,
        apellidoUsuarioOperador
      } = comando;

      if (estado.trim() === "") {
        reject("Ingrese el estado");
        return;
      }

      if (idUsuarioOperador.trim() == "") {
        reject("Ingrese los datos del operador");
        return;
      }

      if (nombreUsuarioOperador.trim() == "") {
        reject("Ingrese los datos del operador");
        return;
      }

      if (apellidoUsuarioOperador.trim() == "") {
        reject("Ingrese los datos del operador");
        return;
      }

      var db = firebase.firestore();

      db.collection("reclamo")
        .where("numero", "==", parseInt(numero))
        .get()
        .then(docs => {
          docs = docs.docs;
          let reclamos = [];
          docs.forEach(d => {
            reclamos.push(d.data());
          });

          let id = db.collection("reclamo").doc().id;

          let ultimaVersion = _.reverse(_.orderBy(reclamos, "fecha"))[0];
          ultimaVersion.estado = estado;
          ultimaVersion.observaciones = observaciones;
          ultimaVersion.id = id;
          ultimaVersion.idUsuarioOperador = idUsuarioOperador;
          ultimaVersion.nombreUsuarioOperador = nombreUsuarioOperador;
          ultimaVersion.apellidoUsuarioOperador = apellidoUsuarioOperador;
          ultimaVersion.fecha = new Date().getTime();

          let paraIpfs = _.omit(ultimaVersion, "ipfsHash");
          paraIpfs = _.omit(paraIpfs, "transactionHash");

          Rules_IPFS.insertar({
            nombre: "Reclamo Nº" + paraIpfs.numero,
            contenido: JSON.stringify(paraIpfs)
          })
            .then(({ hash }) => {
              ultimaVersion.ipfsHash = hash;

              Rules_Account.enviarMensaje({
                privateKey: privateKey,
                address: ultimaVersion.account.address,
                mensaje: hash
              })
                .then(data => {
                  ultimaVersion.transactionHash = data.transactionHash.data;

                  db.collection("reclamo")
                    .doc(id)
                    .set(ultimaVersion)
                    .then(() => {
                      resolve(ultimaVersion);
                    })
                    .catch(({ message }) => {
                      reject(message);
                    });
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  },
  crearSupervisor: comando => {
    return new Promise((resolve, reject) => {
      let { nombre, apellido, dni, username, password } = comando;
      if (nombre.trim() === "") {
        reject("Ingrese el nombre");
        return;
      }

      if (apellido.trim() === "") {
        reject("Ingrese el apellido");
        return;
      }

      if (dni.trim() === "") {
        reject("Ingrese el dni");
        return;
      }

      if (username.trim() === "") {
        reject("Ingrese el username");
        return;
      }

      if (password.trim() === "") {
        reject("Ingrese el password");
        return;
      }

      var db = firebase.firestore();

      db.collection("empleado")
        .where("rol", "==", 2)
        .where("dni", "==", dni)
        .get()
        .then(dataDni => {
          let existePorDni = dataDni.size > 0;
          if (existePorDni) {
            reject("DNI duplicado");
            return;
          }

          db.collection("empleado")
            .where("rol", "==", 2)
            .where("username", "==", username)
            .get()
            .then(dataUsername => {
              let existePorUsername = dataUsername.size > 0;
              if (existePorUsername) {
                reject("Username duplicado");
                return;
              }

              Rules_Account.crear({
                nombre: nombre + " " + apellido,
                password: password
              })
                .then(({ account, wlt }) => {
                  let user = {
                    rol: 2,
                    nombre: nombre,
                    apellido: apellido,
                    dni: dni,
                    username: username,
                    password: password,
                    address: account.address.value,
                    privateKey: account.privateKey,
                    publicKey: account.publicKey,
                    wlt: wlt,
                    fechaAlta: new Date().getTime()
                  };

                  let id = db.collection("empleado").doc().id;
                  user.id = id;

                  db.collection("empleado")
                    .doc(id)
                    .set(user)
                    .then(() => {
                      Rules_Account.transferir({
                        address: user.address,
                        privateKey: ADMIN_PRIVATE_KEY,
                        cantidad: 100
                      })
                        .then(() => {
                          resolve(user);
                        })
                        .catch(({ message }) => {
                          reject(message);
                        });
                    })
                    .catch(({ message }) => {
                      reject(message);
                    });
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(({ message }) => {
              reject(message);
            });
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  },
  acceder: comando => {
    return new Promise((resolve, reject) => {
      let { username, password } = comando;
      if (username == undefined || username.trim() == "") {
        reject("Ingrese el username");
        return;
      }

      if (password == undefined || password.trim() == "") {
        reject("Ingrese el password");
        return;
      }

      var db = firebase.firestore();
      db.collection("empleado")
        .where("username", "==", username)
        .where("password", "==", password)
        .get()
        .then(data => {
          let existe = data.size > 0;
          if (!existe) {
            reject("Nombre de usuario o contraseña incorrectos");
            return;
          }
          resolve(data.docs[0].data());
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  }
};

export default metodos;
