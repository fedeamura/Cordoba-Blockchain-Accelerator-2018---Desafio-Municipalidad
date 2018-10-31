import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";
import { login } from "@Redux/Actions/usuario";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

// Components Material UI
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";
import VpnKey from "@material-ui/icons/VpnKey";
import Button from "@material-ui/core/Button";

//Mis Componentes
import MiPagina from "@Componentes/MiPagina";
import MiCardLogin from "@Componentes/MiCardLogin";

import Rules_Usuario from "@Rules/Rules_Usuario";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  login: user => {
    dispatch(login(user));
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      username: "",
      password: ""
    };
  }

  crearUsuario = () => {
    this.props.redireccionar("/CrearUsuario");
  };

  loggin = () => {
    let { username, password } = this.state;

    if (username == "" || password == "") {
      alert("Ingrese user y pass");
      return;
    }

    this.setState({ cargando: true }, () => {
      Rules_Usuario.acceder({
        username: username,
        password: password
      })
        .then(data => {
          this.setState({ cargando: true });
          this.props.login(data);
          this.props.redireccionar("/Dashboard");
        })
        .catch(error => {
          alert(error);
          this.setState({ cargando: false });
        });
    });
  };

  onInput = e => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiPagina cargando={this.state.cargando} mostrarLogin={false}>
            <MiCardLogin
              visible={true}
              titulo="Sistema de Reclamos"
              subtitulo="Login"
              rootClassName={classes.root}
            >
              <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Usuario"
                name="username"
                value={this.state.username}
                onChange={this.onInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Contraseña"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.onInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                className={classes.button}
                color="secondary"
                variant="contained"
                onClick={this.loggin}
              >
                Iniciar Sesión
              </Button>
              <br />
              <Button
                className={classes.button}
                onClick={this.crearUsuario}
                color="secondary"
                variant="outlined"
              >
                Crear Usuario
              </Button>
            </MiCardLogin>
          </MiPagina>
        </div>
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
