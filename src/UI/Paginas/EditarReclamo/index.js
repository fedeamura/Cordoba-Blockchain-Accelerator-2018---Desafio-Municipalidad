import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

// Components Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import CardActions from "@material-ui/core/CardActions";

//Mis Componentes
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";
import Rules_Reclamo from "@Rules/Rules_Reclamo";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  }
});

class EditarReclamo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      numero: this.props.match.params.numero,
      estado: "Nuevo",
      observaciones: ""
    };
  }

  onBotonVolverClick = () => {
    this.props.redireccionar("/DashboardOperador");
  };

  onSelect = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onInput = e => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  guardar = () => {
    let { observaciones, estado } = this.state;

    this.setState({ cargando: true }, () => {
      Rules_Reclamo.editar({
        numero: this.state.numero,
        observaciones: observaciones,
        estado: estado,
        privateKey: this.props.usuario.account.privateKey,
        idUsuarioOperador: this.props.usuario.id,
        nombreUsuarioOperador: this.props.usuario.nombre,
        apellidoUsuarioOperador: this.props.usuario.apellido
      })
        .then(() => {
          this.props.redireccionar("/DashboardOperador");
          this.setState({ cargando: false });
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
            <MiCard titulo={`Editando Reclamo`} padding={false}>
              <Grid container>
                <Grid item xs={12} className={classes.marginGrid}>
                  <TextField
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    value={this.state.observaciones}
                    onChange={this.onInput}
                    name="observaciones"
                    label="Observación"
                    multiline
                  />
                </Grid>
                <Grid item xs={12} className={classes.marginGrid}>
                  <InputLabel htmlFor="age-simple">Estado</InputLabel>
                  <Select
                    value={this.state.estado}
                    onChange={this.onSelect}
                    inputProps={{
                      name: "estado",
                      id: "age-simple"
                    }}
                    className={classes.margin}
                  >
                    <MenuItem value={"Nuevo"}>Nuevo</MenuItem>
                    <MenuItem value={"En proceso"}>En Proceso</MenuItem>
                    <MenuItem value={"Finalizado"}>Finalizado</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <CardActions
                style={{
                  justifyContent: "flex-end",
                  borderTop: "1px solid #ccc"
                }}
              >
                <Button variant="outlined" onClick={this.onBotonVolverClick}>
                  Volver
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={this.guardar}
                >
                  Editar
                </Button>
              </CardActions>
            </MiCard>
          </MiPagina>
        </div>
      </React.Fragment>
    );
  }
}

let componente = EditarReclamo;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
