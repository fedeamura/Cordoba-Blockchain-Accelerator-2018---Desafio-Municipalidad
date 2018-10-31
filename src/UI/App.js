import React from "react";

//Styles
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import "./style.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

//Router
import { withRouter } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

//REDUX
import { connect } from "react-redux";
import { ocultarAlerta } from "@Redux/Actions/alerta";

//Componentes
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { IconButton, Icon } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { NEMLibrary, NetworkTypes } from "nem-library";

//Mis componentes
import Login from "./Login";
import LoginOperador from "./LoginOperador";

import CrearUsuario from "@UI/Paginas/CrearUsuario/index";
import Dashboard from "@UI/Paginas/Dashboard/index";
import DashboardOperador from "@UI/Paginas/DashboardOperador/index";
import CrearReclamo from "@UI/Paginas/CrearReclamo/index";
import VerReclamo from "@UI/Paginas/VerReclamo/index";
import ValidarReclamo from "@UI/Paginas/ValidarReclamo/index";
import EditarReclamo from "@UI/Paginas/EditarReclamo/index";
import VerIPFS from "@UI/Paginas/VerIPFS/index";
import VerTransaccionBlockchain from "@UI/Paginas/VerTransaccionBlockchain/index";
import VerBlockchainCuenta from "@UI/Paginas/VerBlockchainCuenta";
import Pagina404 from "@UI/_Pagina404";
import * as firebase from "firebase";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#fff"
    },
    secondary: {
      main: "#149257"
    },
    background: {
      default: "#eee"
    }
  },
  button: {
    display: "inline-block",
    minWidth: "auto",
    margin: "2px",
    borderRadius: "20px"
  },
  color: {
    ok: {
      main: "#149257"
    },
    error: {
      main: "#F44336"
    },
    info: {
      main: "#2196f3"
    }
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

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    alertas: state.Alerta.alertas
  };
};

const mapDispatchToProps = dispatch => ({
  onAlertaClose: id => {
    dispatch(ocultarAlerta(id));
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

    const firestore = firebase.firestore();
    const settings = { timestampsInSnapshots: true };
    firestore.settings(settings);
  }

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          {this.renderContent()}
          {this.renderAlertas()}
        </div>
      </MuiThemeProvider>
    );
  }

  renderContent() {
    const { classes } = this.props;

    return (
      <main className={classes.content}>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className={"switch-wrapper"}
        >
          <Route path="/Login" component={Login} />
          <Route path="/LoginOperador" component={LoginOperador} />

          <Route path="/CrearUsuario" component={CrearUsuario} />
          <Route
            path="/Dashboard"
            component={this.props.usuario && Dashboard}
          />
          <Route
            path="/DashboardOperador"
            component={this.props.usuario && DashboardOperador}
          />
          <Route
            path="/CrearReclamo"
            component={this.props.usuario && CrearReclamo}
          />
          <Route
            path="/VerReclamo/:numero"
            component={this.props.usuario && VerReclamo}
          />
          <Route
            path="/ValidarReclamo/:id"
            component={this.props.usuario && ValidarReclamo}
          />
          <Route
            path="/EditarReclamo/:numero"
            component={this.props.usuario && EditarReclamo}
          />

          <Route path="/VerIPFS/:hash" component={VerIPFS} />
          <Route
            path="/VerTransaccionBlockchain/:hash"
            component={VerTransaccionBlockchain}
          />

          <Route
            path="/VerBlockchainCuenta/:address"
            component={VerBlockchainCuenta}
          />

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
}

const styles = theme => {
  return {
    root: {
      display: "flex",
      height: "100vh",
      overflow: "hidden"
    },
    content: {
      display: "flex",
      flexGrow: 1,
      overflow: "auto",
      overflow: "hidden"
    },
    icon: {
      fontSize: 20
    },
    snackCustomIcon: {
      marginRight: theme.spacing.unit
    },
    snackMessage: {
      display: "flex",
      alignItems: "center"
    }
  };
};

let componente = App;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
