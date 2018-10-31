import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import styles from "./styles";

//Router
import { Route, withRouter } from "react-router-dom";
import { login } from "@Redux/Actions/usuario";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

// Components Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

//Mis Componentes
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";
import MiCardLogin from "@Componentes/MiCardLogin";

import Rules_Usuario from "@Rules/Rules_Usuario";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    cargando: state.MainContent.cargando
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

const limite = "lg";
class CrearUsuario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      cargando: false
    };
  }

  onInput = e => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  guardar = () => {
    let { username, telefono, password, nombre, apellido, dni } = this.state;

    this.setState({ cargando: true }, () => {
      Rules_Usuario.crear({
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        telefono: telefono,
        username: username,
        password: password
      })
        .then(data => {
          this.setState({ cargando: false });
          this.props.login(data);
          this.props.redireccionar("/Dashboard");
        })
        .catch(error => {
          alert(error);
          this.setState({ cargando: false });
        });
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiPagina cargando={this.state.cargando}>
            <MiCardLogin
              visible={true}
              titulo="Sistema de Reclamos"
              subtitulo="Crear Usuario"
              rootClassName={classes.root}
            >
              <Grid container>
                <Grid item xs={6} className={classes.marginGrid}>
                  <TextField
                    className={classes.margin}
                    value={this.state.username}
                    name="username"
                    onChange={this.onInput}
                    id="input-with-icon-textfield"
                    label="Username"
                  />
                </Grid>
                <Grid item xs={6} className={classes.marginGrid}>
                  <TextField
                    className={classes.margin}
                    value={this.state.password}
                    name="password"
                    onChange={this.onInput}
                    id="input-with-icon-textfield"
                    label="Contraseña"
                    type="password"
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={6} className={classes.marginGrid}>
                  <TextField
                    value={this.state.nombre}
                    name="nombre"
                    onChange={this.onInput}
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    label="Nombre"
                  />
                </Grid>
                <Grid item xs={6} className={classes.marginGrid}>
                  <TextField
                    value={this.state.apellido}
                    name="apellido"
                    onChange={this.onInput}
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    label="Apellido"
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={6} className={classes.marginGrid}>
                  <TextField
                    className={classes.margin}
                    value={this.state.dni}
                    name="dni"
                    onChange={this.onInput}
                    id="input-with-icon-textfield"
                    label="Documento"
                  />
                </Grid>
                <Grid item xs={6} className={classes.marginGrid}>
                  <TextField
                    className={classes.margin}
                    value={this.state.telefono}
                    name="telefono"
                    onChange={this.onInput}
                    id="input-with-icon-textfield"
                    label="Teléfono"
                  />
                </Grid>
              </Grid>

              <Button
                className={classes.button}
                color="secondary"
                onClick={this.guardar}
                variant="contained"
              >
                Crear
              </Button>
            </MiCardLogin>
          </MiPagina>
        </div>
      </React.Fragment>
    );
  }
}

let componente = undefined;
componente = withStyles(styles)(CrearUsuario);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
