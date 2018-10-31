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

const ADMIN_PRIVATE_KEY =
  '"a96c00a512be561230028ab99d04c5ee8848e586e7a1050425cf5c8056d55306';

const ZEN_NUEVO_USUARIO = 50;

const metodos = {
  crear: comando => {
    return new Promise((resolve, reject) => {
      let { nombre, apellido, dni, username, password, telefono } = comando;
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

      if (telefono.trim() === "") {
        reject("Ingrese el telefono");
        return;
      }

      var db = firebase.firestore();

      db.collection("usuario")
        .where("dni", "==", dni)
        .get()
        .then(dataDni => {
          if (dataDni.empty == false) {
            reject("DNI duplicado");
            return;
          }

          db.collection("usuario")
            .where("username", "==", username)
            .get()
            .then(dataUsername => {
              if (dataUsername.empty == false) {
                reject("Username duplicado");
                return;
              }

              Rules_Account.crear({
                nombre: nombre + " " + apellido,
                password: password
              })
                .then(({ account, wlt }) => {
                  let id = db.collection("usuario").doc().id;

                  let user = {
                    id: id,
                    nombre: nombre,
                    apellido: apellido,
                    dni: dni,
                    username: username,
                    password: password,
                    telefono: telefono,
                    fechaAlta: new Date().getTime(),
                    account: {
                      address: account.address.value,
                      privateKey: account.privateKey,
                      publicKey: account.publicKey,
                      wlt: wlt
                    }
                  };

                  db.collection("usuario")
                    .doc(id)
                    .set(user)
                    .then(() => {
                      Rules_Account.transferir({
                        address: user.account.address,
                        privateKey: ADMIN_PRIVATE_KEY,
                        cantidad: ZEN_NUEVO_USUARIO
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
      db.collection("usuario")
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
