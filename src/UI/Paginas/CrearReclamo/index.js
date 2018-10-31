import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import styles from "./styles";

//Router
import { Route, withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

// Components Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

//Mis Componentes
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";
import DialogoCuentaNueva from "@UI/_Dialogos/NuevaCuenta";
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

const limite = "lg";
class CrearReclamo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      descripcion: "",
      empresa: "",
      tipo: "Producto",
      subtipo: "Faltante",
      //Dialogo
      dialogoCuentaNuevaVisible: false,
      dialogoCuentaNuevaData: undefined
    };
  }

  dashboard = () => {
    this.props.redireccionar("/Dashboard");
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onInput = e => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  crear = () => {
    let { descripcion, empresa, tipo, subtipo } = this.state;
    this.setState({ cargando: true }, () => {
      Rules_Reclamo.crear({
        tipo: tipo,
        subtipo: subtipo,
        empresa: empresa,
        descripcion: descripcion,
        idUsuarioCreador: this.props.usuario.id,
        nombreUsuarioCreador: this.props.usuario.nombre,
        apellidoUsuarioCreador: this.props.usuario.apellido,
        privateKey: this.props.usuario.account.privateKey
      })
        .then(data => {
          this.setState({ cargando: false });
          this.mostrarDialogoCuentaNueva(data.account);
        })
        .catch(error => {
          alert(error);
          this.setState({ cargando: false });
        });
    });
  };

  mostrarDialogoCuentaNueva = cuenta => {
    this.setState({
      dialogoCuentaNuevaData: cuenta,
      dialogoCuentaNuevaVisible: true
    });
  };

  onDialogoCuentaNuevaBotonAceptarClick = () => {
    this.setState(
      {
        dialogoCuentaNuevaVisible: false
      },
      () => {
        this.props.redireccionar("/Dashboard");
      }
    );
  };
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiPagina cargando={this.state.cargando}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <MiCard>
                  <Typography variant="headline" style={{ fontWeight: 200 }}>
                    Crear Reclamo
                  </Typography>
                  <Divider />
                  <Grid container>
                    <Grid item xs={12} className={classes.marginGrid}>
                      <TextField
                        value={this.state.descripcion}
                        onChange={this.onInput}
                        className={classes.margin}
                        name="descripcion"
                        id="input-with-icon-textfield"
                        label="Descripción"
                        multiline
                      />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12} className={classes.marginGrid}>
                      <TextField
                        value={this.state.empresa}
                        onChange={this.onInput}
                        className={classes.margin}
                        name="empresa"
                        id="input-with-icon-textfield"
                        label="Empresa"
                      />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={6} className={classes.marginGrid}>
                      <InputLabel htmlFor="age-simple">Tipo</InputLabel>
                      <Select
                        value={this.state.tipo}
                        onChange={this.handleChange}
                        inputProps={{
                          name: "tipo",
                          id: "age-simple"
                        }}
                        className={classes.margin}
                      >
                        <MenuItem value={"Producto"}>Producto</MenuItem>
                        <MenuItem value={"Servicio"}>Servicio</MenuItem>
                        <MenuItem value={"Producto/Servicio"}>
                          Producto/Servicio
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={6} className={classes.marginGrid}>
                      <InputLabel htmlFor="age-simple">Sub Tipo</InputLabel>
                      <Select
                        value={this.state.subtipo}
                        onChange={this.handleChange}
                        inputProps={{
                          name: "subtipo",
                          id: "age-simple"
                        }}
                        className={classes.margin}
                      >
                        <MenuItem value={"Faltante"}>Faltante</MenuItem>
                        <MenuItem value={"Pago"}>Pago</MenuItem>
                        <MenuItem value={"Denuncia"}>Denuncia</MenuItem>
                        <MenuItem value={"Estado"}>Estado</MenuItem>
                        <MenuItem value={"Devolución"}>Devolución</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12} className={classes.marginGrid}>
                      <Button
                        className={classes.button}
                        color="secondary"
                        variant="contained"
                        onClick={this.crear}
                      >
                        Crear
                      </Button>
                    </Grid>
                  </Grid>
                </MiCard>
              </Grid>
            </Grid>
          </MiPagina>
        </div>

        <DialogoCuentaNueva
          open={this.state.dialogoCuentaNuevaVisible}
          cuenta={this.state.dialogoCuentaNuevaData}
          onBotonAceptarClick={this.onDialogoCuentaNuevaBotonAceptarClick}
        />
      </React.Fragment>
    );
  }
}

let componente = undefined;
componente = withStyles(styles)(CrearReclamo);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
