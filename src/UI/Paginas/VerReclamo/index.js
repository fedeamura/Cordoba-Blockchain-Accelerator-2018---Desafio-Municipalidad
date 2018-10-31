import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push, goBack } from "connected-react-router";

// Components
import _ from "lodash";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";

//Mis Componentes
import MiPagina from "@Componentes/MiPagina";
import MiContent from "@Componentes/MiContent";
import MiCard from "@Componentes/MiCard";
import { getAllUrlParams } from "@Utils/functions";

//Rules
import Rules_Reclamo from "@Rules/Rules_Reclamo";
import Rules_IPFS from "@Rules/Rules_IPFS";
import { CircularProgress, IconButton, Icon } from "@material-ui/core";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  goBack: () => {
    dispatch(goBack());
  }
});

class VerReclamo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      reclamos: [],
      numero: this.props.match.params.numero
    };
  }

  componentDidMount() {
    this.buscar();
  }

  buscar = () => {
    this.setState({ cargando: true }, () => {
      Rules_Reclamo.getByNumero(this.state.numero)
        .then(data => {
          console.log(data);
          this.setState({ reclamos: data });
          this.setState({ cargando: false });
        })
        .catch(error => {
          alert(error);
          this.setState({ cargando: false });
        });
    });
  };

  validarReclamo = id => {
    this.props.redireccionar(
      "/ValidarReclamo/" + id + "?redirect=/VerReclamo/" + this.state.numero
    );
  };

  verBlockchain = t => {
    this.props.redireccionar("/VerTransaccionBlockchain/" + t);

    // let url = "http://bob.nem.ninja:8765/#/search/" + t;
    // var win = window.open(url, "_blank");
    // win.focus();
  };

  verBlockchainCuenta = () => {
    if (this.state.reclamos.length == 0) return;
    this.props.redireccionar(
      "/VerBlockchainCuenta/" + this.state.reclamos[0].account.address
    );
  };
  verIPFS = hash => {
    this.props.redireccionar("/VerIPFS/" + hash);
  };

  onBotonVolverClick = () => {
    this.props.goBack();
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiPagina cargando={this.state.cargando}>
            <MiContent>
              <Button
                onClick={this.verBlockchainCuenta}
                variant="outlined"
                color="secondary"
                style={{ margin: "16px" }}
              >
                Ver en blockchain
              </Button>
              <Grid container spacing={24}>
                {this.state.reclamos.map((x, index) => {
                  return (
                    <Grid item xs={12} key={index}>
                      <ItemReclamo
                        onVerBlockchain={this.verBlockchain}
                        onVerIPFS={this.verIPFS}
                        onValidar={this.validarReclamo}
                        x={x}
                        classes={classes}
                      />
                    </Grid>
                  );
                })}
              </Grid>

              <Grid container>
                <Grid item xs={12} className={classes.marginGrid}>
                  <Button
                    className={classes.button}
                    color="secondary"
                    variant="contained"
                    onClick={this.onBotonVolverClick}
                  >
                    Volver
                  </Button>
                </Grid>
              </Grid>
            </MiContent>
          </MiPagina>
        </div>
      </React.Fragment>
    );
  }
}

class ItemReclamo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ipfs: undefined,
      cargando: false,
      validado: undefined
    };
  }

  componentDidMount() {
    this.buscarIPFS(this.props.x.ipfsHash);
  }

  buscarIPFS = hash => {
    this.setState({ cagando: true }, () => {
      Rules_IPFS.leer(hash)
        .then(ipfs => {
          let validado = false;
          if (ipfs) {
            let dataFirebase = this.props.x;
            dataFirebase = _.omit(dataFirebase, "transactionHash");
            dataFirebase = _.omit(dataFirebase, "ipfsHash");

            ipfs = JSON.parse(ipfs);
            validado = _.isEqual(dataFirebase, ipfs);
          }
          this.setState({ ipfs: ipfs, cargando: false, validado: validado });
        })
        .catch(error => {
          this.setState({ error: error, cargando: false });
        });
    });
  };

  onBotonVerIPFSClick = () => {
    this.props.onVerIPFS && this.props.onVerIPFS(this.props.x.ipfsHash);
  };

  onBotonValidarClick = () => {
    this.props.onValidar && this.props.onValidar(this.props.x.id);
  };

  onBotonVerBlockchainClick = () => {
    this.props.onVerBlockchain &&
      this.props.onVerBlockchain(this.props.x.transactionHash);
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
    let { x } = this.props;

    return (
      <MiCard padding={false}>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex" }}>
            <Typography variant="display1" style={{ flex: 1 }}>
              Reclamo Nº : {x.numero}
            </Typography>
            {this.state.cargando && <CircularProgress />}

            {this.state.validado !== undefined && (
              <IconButton
                onClick={this.onBotonValidarClick}
                style={{ color: this.state.validado ? "green" : "red" }}
              >
                <Icon>
                  {this.state.validado
                    ? "check_circle_outline"
                    : "error_outline"}
                </Icon>
              </IconButton>
            )}
            {/* {this.state.cargando === false && validado != -1 ? (
              validado == 1 ? (
                <Typography>OK</Typography>
              ) : (
                <Typography>Error</Typography>
              )
            ) : (
              <Typography />
            )} */}
          </div>

          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "rgba(0,0,0,0.05)",
              borderRadius: "8px"
            }}
          >
            <Typography variant="body2">
              <b>Estado: </b>
              {x.estado || "Sin datos"}
            </Typography>
            <Typography variant="body2">
              <b>Observaciones: </b>
              {x.observaciones || "Sin datos"}
            </Typography>
          </div>

          <div style={{ padding: "16px" }}>
            <Typography variant="body1">
              <b>Descripción: </b>
              {x.descripcion || "Sin datos"}
            </Typography>

            <Typography variant="body1">
              <b>Tipo: </b>
              {x.tipo || "Sin datos"}
            </Typography>

            <Typography variant="body1">
              <b>Subtipo: </b>
              {x.subtipo || "Sin datos"}
            </Typography>

            {x.nombreUsuarioCreador ? (
              <Typography variant="body1">
                <b>Creador: </b>
                {x.nombreUsuarioCreador + " " + x.apellidoUsuarioCreador}
              </Typography>
            ) : (
              <Typography variant="body1">
                <b>Creador: </b>
                Sin datos
              </Typography>
            )}

            {x.nombreUsuarioOperador ? (
              <Typography variant="body1">
                <b>Operador: </b>
                {x.nombreUsuarioOperador + " " + x.apellidoUsuarioOperador}
              </Typography>
            ) : (
              <Typography variant="body1">
                <b>Operador: </b>
                Sin datos
              </Typography>
            )}

            {x.fecha ? (
              <Typography variant="body1">
                <b>Fecha de modificación: </b>
                {this.formatearFecha(parseInt(x.fecha))}
              </Typography>
            ) : (
              <Typography variant="body1">
                <b>Fecha de modificación: </b>
                Sin datos
              </Typography>
            )}

            {x.fechaAlta ? (
              <Typography variant="body1">
                <b>Fecha de creación: </b>
                {this.formatearFecha(parseInt(x.fechaAlta))}
              </Typography>
            ) : (
              <Typography variant="body1">
                <b>Fecha de creación: </b>
                Sin datos
              </Typography>
            )}
          </div>
        </div>

        <CardActions
          style={{ justifyContent: "flex-end", borderTop: "1px solid #ccc" }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={this.onBotonVerIPFSClick}
          >
            Ver IPFS
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={this.onBotonVerBlockchainClick}
          >
            Ver Blockchain
          </Button>
        </CardActions>
      </MiCard>
    );
  }
}

let componente = VerReclamo;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
