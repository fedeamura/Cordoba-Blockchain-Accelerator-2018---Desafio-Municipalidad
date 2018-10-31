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
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

//Mis Componentes
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";
import MiTabla from "@Componentes/MiTabla";

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
class DashboardOperador extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reclamos: [],
      cargando: false
    };
  }

  componentDidMount() {
    this.buscar();
  }

  buscar = () => {
    this.setState({ cargando: true }, () => {
      Rules_Reclamo.get()
        .then(reclamos => {
          this.setState({ cargando: false });
          this.setState({ reclamos: reclamos });
        })
        .catch(error => {
          alert(error);
          this.setState({ cargando: false });
        });
    });
  };

  crearReclamo = () => {
    this.props.redireccionar("/crearReclamo");
  };

  editar = event => {
    var numero = event.currentTarget.attributes.numero.value;
    this.props.redireccionar("/editarReclamo/" + numero);
  };

  verReclamo = event => {
    var numero = event.currentTarget.attributes.numero.value;
    this.props.redireccionar("/VerReclamo/" + numero);
  };

  formatearFecha = intFecha => {
    let date = new Date(parseInt(intFecha));
    let dia = date.getDate();
    if (dia < 10) dia = "0" + dia;
    let mes = date.getMonth() + 1;
    if (mes < 10) mes = "0" + mes;
    let año = date.getFullYear();
    let hora = date.getHours();
    if (hora < 10) hora = "0" + hora;
    let min = date.getMinutes();
    if (min < 10) min = "0" + min;
    return `${dia}/${mes}/${año} ${hora}:${min}`;
  };

  render() {
    const { classes, width, location } = this.props;

    let rows = this.state.reclamos.map(x => {
      return {
        numero: x.numero,
        estado: x.estado,
        fecha: this.formatearFecha(parseInt(x.fecha)),
        tipo: x.tipo,
        subtipo: x.subtipo,
        detalle: (
          <Button
            className={classes.buttonMiTabla}
            onClick={this.verReclamo}
            numero={x.numero}
            color="secondary"
            variant="outlined"
          >
            Ver Detalle
          </Button>
        ),
        editar: (
          <Button
            className={classes.buttonMiTabla}
            onClick={this.editar}
            numero={x.numero}
            color="secondary"
            variant="outlined"
          >
            Editar
          </Button>
        )
      };
    });

    let rowsMias = this.state.reclamos
      .filter(x => {
        return x.idUsuarioOperador == this.props.usuario.id;
      })
      .map(x => {
        return {
          numero: x.numero,
          estado: x.estado,
          fecha: this.formatearFecha(parseInt(x.fecha)),
          tipo: x.tipo,
          subtipo: x.subtipo,
          detalle: (
            <Button
              className={classes.buttonMiTabla}
              onClick={this.verReclamo}
              numero={x.numero}
              color="secondary"
              variant="outlined"
            >
              Ver Detalle
            </Button>
          ),
          editar: (
            <Button
              className={classes.buttonMiTabla}
              onClick={this.editar}
              numero={x.numero}
              color="secondary"
              variant="outlined"
            >
              Editar
            </Button>
          )
        };
      });

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiPagina cargando={this.state.cargando}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <MiCard titulo="Mis reclamos" padding={false}>
                  <MiTabla
                    order="desc"
                    orderBy="nombre"
                    rowsPerPage={5}
                    columns={[
                      {
                        id: "numero",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: "Numero"
                      },
                      {
                        id: "estado",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: "Estado"
                      },
                      {
                        id: "fecha",
                        numeric: false,
                        disablePadding: false,
                        type: "datetime",
                        label: "Fecha"
                      },
                      {
                        id: "tipo",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: "Tipo"
                      },
                      {
                        id: "subtipo",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: "Subtipo"
                      },
                      {
                        id: "detalle",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: ""
                      },
                      {
                        id: "editar",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: ""
                      }
                    ]}
                    rows={rowsMias}
                  />
                </MiCard>
              </Grid>
              <Grid item xs={12}>
                <MiCard titulo="Todos los reclamos" padding={false}>
                  <MiTabla
                    order="desc"
                    orderBy="nombre"
                    rowsPerPage={5}
                    columns={[
                      {
                        id: "numero",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: "Numero"
                      },
                      {
                        id: "estado",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: "Estado"
                      },
                      {
                        id: "fecha",
                        numeric: false,
                        disablePadding: false,
                        type: "datetime",
                        label: "Fecha"
                      },
                      {
                        id: "tipo",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: "Tipo"
                      },
                      {
                        id: "subtipo",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: "Subtipo"
                      },
                      {
                        id: "detalle",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: ""
                      },
                      {
                        id: "editar",
                        numeric: false,
                        disablePadding: false,
                        type: "string",
                        label: ""
                      }
                    ]}
                    rows={rows}
                  />
                </MiCard>
              </Grid>
            </Grid>
          </MiPagina>
        </div>
      </React.Fragment>
    );
  }
}

let componente = DashboardOperador;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
