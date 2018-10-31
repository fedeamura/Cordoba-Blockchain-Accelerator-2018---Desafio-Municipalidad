import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push, goBack } from "connected-react-router";

// Components Material UI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import ReactJson from "react-json-view";

//Mis Componentes
import MiPagina from "@Componentes/MiPagina";
import MiContent from "@Componentes/MiContent";
import MiCard from "@Componentes/MiCard";

//Rules
import Rules_Reclamo from "@Rules/Rules_Reclamo";
import Rules_IPFS from "@Rules/Rules_IPFS";
import { Icon } from "../../../../node_modules/@material-ui/core";

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

class ValidarReclamo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      reclamoData: undefined,
      ipfsData: undefined,
      validado: undefined,
      id: this.props.match.params.id
    };
  }

  componentDidMount() {
    this.buscar();
  }

  buscar = () => {
    this.setState({ cargando: true }, () => {
      Rules_Reclamo.getById(this.state.id)
        .then(data => {
          let ipfsHash = data.ipfsHash;
          data = _.omit(data, "transactionHash");
          data = _.omit(data, "ipfsHash");

          Rules_IPFS.leer(ipfsHash)
            .then(dataIPFS => {
              dataIPFS = JSON.parse(dataIPFS);

              let dataOrdenado = {};
              Object.keys(data)
                .sort()
                .forEach(function(key) {
                  dataOrdenado[key] = data[key];
                });
              data = dataOrdenado;

              let dataIPFSOrdenado = {};
              Object.keys(dataIPFS)
                .sort()
                .forEach(function(key) {
                  dataIPFSOrdenado[key] = dataIPFS[key];
                });
              dataIPFS = dataIPFSOrdenado;

              let validado = _.isEqual(data, dataIPFS);

              this.setState({
                ipfsData: dataIPFS,
                reclamoData: data,
                validado: validado,
                cargando: false
              });
            })
            .catch(error => {
              alert(error);
              this.setState({ cargando: false });
            });
        })
        .catch(error => {
          alert(error);
          this.setState({ cargando: false });
        });
    });
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
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <MiCard className={classes.cardInfo}>
                    <Icon>info_outline</Icon>
                    <Typography variant="body1">
                      En esta pantalla se mostrará la informacion del reclamo.
                      Tanto la almacenada en la Municipalidad de Córdoba como en
                      IPFS (base de datos distribuida sin control por parte de
                      la municipalidad). Si se detecta alguna diferencia entre
                      ambas quiere decir que la información de la municipalidad
                      fue modificada.
                    </Typography>
                  </MiCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MiCard titulo="Municipalidad">
                    <ReactJson
                      src={this.state.reclamoData}
                      displayDataTypes={false}
                    />
                  </MiCard>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MiCard titulo="IPFS">
                    <ReactJson
                      src={this.state.ipfsData}
                      displayDataTypes={false}
                    />
                  </MiCard>
                </Grid>

                {this.state.validado != undefined && (
                  <Grid item xs={12}>
                    <MiCard
                      className={classes.cardInfo}
                      className={classNames(
                        this.state.validado == true
                          ? classes.cardExito
                          : classes.cardError
                      )}
                    >
                      <Icon>
                        {this.state.validado == true
                          ? "check_circle_outline"
                          : "error_outline"}
                      </Icon>
                      <Typography variant="body1">
                        {this.state.validado == true
                          ? "Información confiable"
                          : "Información brindada por la Municipalidad de Córdoba no confiable."}
                      </Typography>
                    </MiCard>
                  </Grid>
                )}
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

let componente = ValidarReclamo;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
