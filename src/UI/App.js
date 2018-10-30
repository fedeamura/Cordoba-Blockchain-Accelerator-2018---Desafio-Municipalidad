import React from "react";

//Styles
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./style.css";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

//REDUX
import { connect } from "react-redux";
import { mostrarAlertaNaranja, ocultarAlerta } from "@Redux/Actions/alerta";
import { login, cerrarSesion } from "@Redux/Actions/usuario";

import { push, replace } from "connected-react-router";

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

//Componentes
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import {
  IconButton,
  Icon,
  Typography,
  Grid,
  Button,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import * as firebase from "firebase";
import TextField from "@material-ui/core/TextField";

//Mis componentes
import Pagina404 from "@UI/_Pagina404";
import Inicio from "@UI/Inicio";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#149257"
    },
    secondary: {
      main: "#149257"
    },
    background: {
      default: "#eee"
    }
  }
});

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    alertas: state.Alerta.alertas
  };
};

const mapDispatchToProps = dispatch => ({
  onAlertaClose: id => {
    dispatch(ocultarAlerta(id));
  },
  mostrarAlertaNaranja: mensaje => {
    dispatch(mostrarAlertaNaranja(mensaje));
  },
  login: comando => {
    dispatch(login(comando));
  },
  cerrarSesion: () => {
    dispatch(cerrarSesion());
  },
  redireccionar: url => {
    dispatch(push(url));
  },
  replace: url => {
    dispatch(replace(url));
  }
});

var config = {
  apiKey: "AIzaSyCJvGfduv7vFRAuwRe0K6rNonqSCoFXUQs",
  authDomain: "proyecto-nem.firebaseapp.com",
  databaseURL: "https://proyecto-nem.firebaseio.com",
  projectId: "proyecto-nem",
  storageBucket: "",
  messagingSenderId: "382993212282"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modoCrearUsuario: false,
      nombre: "",
      apellido: "",
      dni: "",
      username: "fedeamura",
      password: "federico"
    };
  }

  componentDidMount() {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

    const firestore = firebase.firestore();
    const settings = { timestampsInSnapshots: true };
    firestore.settings(settings);
  }

  componentWillUnmount() {}

  onInputChange = e => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  setModoCrearUsuario = () => {
    this.setState({ modoCrearUsuario: true });
  };

  setModoLogin = () => {
    this.setState({ modoCrearUsuario: false });
  };

  acceder = () => {
    let { username, password } = this.state;

    this.setState({ cargando: true }, () => {
      var db = firebase.firestore();
      db.collection("usuarios")
        .where("username", "==", username)
        .where("password", "==", password)
        .get()
        .then(data => {
          this.setState({ cargando: false });

          let existe = data.size > 0;
          if (!existe) {
            this.props.mostrarAlertaNaranja({
              texto: "Nombre de usuario o contraseña incorrectos"
            });
            return;
          }

          this.props.login(data.docs[0].data());
        })
        .catch(error => {
          console.log(error);
          this.setState({ cargando: false });
        });
    });
  };

  crearUsuario = () => {
    let { nombre, apellido, dni, username, password } = this.state;

    if (nombre.trim() === "") {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese el nombre" });
      return;
    }

    if (apellido.trim() === "") {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese el apellido" });
      return;
    }

    if (dni.trim() === "") {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese el dni" });
      return;
    }

    if (username.trim() === "") {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese el username" });
      return;
    }

    if (password.trim() === "") {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese la password" });
      return;
    }

    this.setState({ cargando: true }, () => {
      var db = firebase.firestore();

      db.collection("usuarios")
        .where("dni", "==", dni)
        .get()
        .then(dataDni => {
          let existePorDni = dataDni.size > 0;
          if (existePorDni) {
            this.props.mostrarAlertaNaranja({ texto: "DNI duplicado" });
            this.setState({ cargando: false });
            return;
          }

          db.collection("usuarios")
            .where("username", "==", username)
            .get()
            .then(dataUsername => {
              let existePorUsername = dataUsername.size > 0;
              if (existePorUsername) {
                this.props.mostrarAlertaNaranja({
                  texto: "Username duplicado"
                });
                this.setState({ cargando: false });
                return;
              }

              const simplePassword = new Password(password);
              const simpleWallet = SimpleWallet.create(
                nombre + " " + apellido,
                simplePassword
              );

              const account = simpleWallet.open(simplePassword);

              let user = {
                nombre: nombre,
                apellido: apellido,
                dni: dni,
                username: username,
                password: password,
                address: account.address.value,
                privateKey: account.privateKey,
                publicKey: account.publicKey,
                wlt: simpleWallet.writeWLTFile(),
                fechaAlta: new Date()
              };

              let id = db.collection("usuarios").doc().id;
              user.id = id;

              db.collection("usuarios")
                .doc(id)
                .set(user)
                .then(docRef => {
                  this.props.login(user);
                  this.transferir(user.address);
                  this.setState({ cargando: false });
                })
                .catch(error => {
                  console.log(error);

                  this.props.mostrarAlertaNaranja({
                    texto: "Error creando el usuario"
                  });
                  this.setState({ cargando: false });
                });
            })
            .catch(error => {
              console.log(error);

              this.props.mostrarAlertaNaranja({
                texto: "Error creando el usuario"
              });
              this.setState({ cargando: false });
            });
        })
        .catch(error => {
          console.log(error);

          this.props.mostrarAlertaNaranja({
            texto: "Error creando el usuario"
          });
          this.setState({ cargando: false });
        });
    });
  };

  transferir = recipientAccount => {
    let privateKey =
      "a96c00a512be561230028ab99d04c5ee8848e586e7a1050425cf5c8056d55306";

    const transactionHttp = new TransactionHttp([{ domain: "104.128.226.60" }]);
    const account = Account.createWithPrivateKey(privateKey);
    const amount = new XEM(1);

    const transferTransaction = TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      new Address(recipientAccount),
      amount,
      EmptyMessage
    );
    const signedTransaction = account.signTransaction(transferTransaction);

    transactionHttp
      .announceTransaction(signedTransaction)
      .toPromise()
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });

    // var transferTransaction = nem.model.objects.create("transferTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", 10, "Hello");
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          {this.renderContent()}
          {this.renderAlertas()}
          {this.renderLogin()}
        </div>
      </MuiThemeProvider>
    );
  }

  renderContent() {
    const { classes } = this.props;

    let base = "";

    // const login =
    //   this.state.validandoToken == false && this.props.usuario != undefined;

    const login = this.props.usuario != undefined;

    return (
      <main className={classes.content}>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className={"switch-wrapper"}
        >
          {/* <Route path={`${base}/Login`} component={Login} />
          <Route path={`${base}/Token`} component={ValidarToken} /> */}

          {/* Todas las paginas de aca abajo necesitan usuario logeado */}
          <Route exact path={`${base}/`} component={login ? Inicio : null} />
          {/* <Route
            exact
            path={`${base}/Entidad/:id`}
            component={login ? EntidadDetalle : null}
          />
          <Route
            exact
            path={`${base}/TurneroDetalle/:id`}
            component={login ? TurneroDetalle : null}
          />
          <Route
            exact
            path={`${base}/TurneroCalendario/:id`}
            component={login ? TurneroCalendario : null}
          />
          <Route
            exact
            path={`${base}/Reserva/:id`}
            component={login ? ReservaTurnoDetalle : null}
          />
          <Route
            exact
            path={`${base}/MisReservas`}
            component={login ? ReservasTurnosDeUsuario : null}
          /> */}
          <Route component={Pagina404} />
        </AnimatedSwitch>
      </main>
    );
  }

  renderAlertas() {
    const { classes } = this.props;

    return this.props.alertas.map((alerta, index) => {
      return (
        <Snackbar
          key={alerta.id}
          key={index}
          open={alerta.visible}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          autoHideDuration={5000}
          onClose={() => {
            this.props.onAlertaClose(alerta.id);
          }}
          ContentProps={{
            "aria-describedby": "message-id" + alerta.id
          }}
        >
          <SnackbarContent
            style={{ backgroundColor: alerta.color }}
            aria-describedby="client-snackbar"
            message={
              <span
                id={"message-id" + alerta.id}
                className={classes.snackMessage}
              >
                {alerta.icono != undefined && (
                  <Icon className={classes.snackCustomIcon}>
                    {alerta.icono}
                  </Icon>
                )}
                {alerta.texto}
              </span>
            }
            action={[
              alerta.mostrarIconoCerrar && (
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={() => {
                    this.props.onAlertaClose(alerta.id);
                  }}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>
              )
            ]}
          />
        </Snackbar>
      );
    });
  }

  renderLogin() {
    let { classes, usuario } = this.props;
    if (usuario != undefined) return null;

    return (
      <React.Fragment>
        <div className={classes.contenedorLogin}>
          <Grid container style={{ maxWidth: "500px" }} spacing={16}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Usuario"
                name="username"
                value={this.state.username}
                onChange={this.onInputChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.onInputChange}
                margin="normal"
              />
            </Grid>

            {this.state.modoCrearUsuario === true && (
              <React.Fragment>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={this.state.nombre}
                    onChange={this.onInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="apellido"
                    value={this.state.apellido}
                    onChange={this.onInputChange}
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dni"
                    name="dni"
                    value={this.state.dni}
                    onChange={this.onInputChange}
                    margin="normal"
                  />
                </Grid>
              </React.Fragment>
            )}

            {this.state.modoCrearUsuario === false && (
              <React.Fragment>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    color="primary"
                    onClick={this.setModoCrearUsuario}
                  >
                    Crear usuario
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={this.acceder}
                  >
                    Entrar
                  </Button>
                </Grid>
              </React.Fragment>
            )}

            {this.state.modoCrearUsuario === true && (
              <React.Fragment>
                <Grid item xs={6}>
                  <Button fullWidth color="primary" onClick={this.setModoLogin}>
                    Volver
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={this.crearUsuario}
                  >
                    Crear
                  </Button>
                </Grid>
              </React.Fragment>
            )}
          </Grid>
        </div>
        {this.state.cargando && (
          <div className={classes.contenedorLogin}>
            <CircularProgress />
          </div>
        )}
      </React.Fragment>
    );
  }
}

let componente = App;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
