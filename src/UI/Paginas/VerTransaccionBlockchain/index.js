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
import ReactJson from "react-json-view";

//Mis Componentes
import MiPagina from "@Componentes/MiPagina";
import MiContent from "@Componentes/MiContent";
import MiCard from "@Componentes/MiCard";
import { Typography } from "../../../../node_modules/@material-ui/core";

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

class VerTransaccion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      data: undefined,
      hash: this.props.match.params.hash
    };
  }

  componentDidMount() {
    this.buscar();
  }

  buscar = () => {
    this.setState({ cargando: true }, () => {
      let url =
        "http://104.128.226.60:7890/transaction/get?hash=" + this.state.hash;
      fetch(url)
        .then(data => data.json())
        .then(data => {
          let dataOrdenada = {};
          Object.keys(data)
            .sort()
            .forEach(function(key) {
              dataOrdenada[key] = data[key];
            });
          data = dataOrdenada;
          this.setState({ data: data, cargando: false });
        })
        .catch(({ message }) => {
          alert(message);
          this.setState({ cargando: false });
        });

      // Rules_IPFS.leer(this.state.hash)
      //   .then(dataIPFS => {
      //     dataIPFS = JSON.parse(dataIPFS);
      //     let dataIPFSOrdenado = {};
      //     Object.keys(dataIPFS)
      //       .sort()
      //       .forEach(function(key) {
      //         dataIPFSOrdenado[key] = dataIPFS[key];
      //       });
      //     dataIPFS = dataIPFSOrdenado;
      //     this.setState({
      //       ipfsData: dataIPFS,
      //       cargando: false
      //     });
      //   })
      //   .catch(error => {
      //     alert(error);
      //     this.setState({ cargando: false });
      //   });
    });
  };

  onBotonVolverClick = () => {
    this.props.goBack();
  };

  hex2a = hexx => {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
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
                  <MiCard titulo={`Transaccion Blockchain`}>
                    <Typography variant="caption">
                      Hash: {this.state.hash}
                    </Typography>
                    <div style={{ height: "16px" }} />

                    {this.state.data && (
                      <React.Fragment>
                        <ReactJson
                          src={this.state.data}
                          displayDataTypes={false}
                        />

                        {this.state.data.transaction &&
                          this.state.data.transaction.message && (
                            <Typography variant="body1">
                              <b>Mensaje: </b>
                              {this.hex2a(
                                this.state.data.transaction.message.payload
                              )}
                            </Typography>
                          )}
                      </React.Fragment>
                    )}
                  </MiCard>
                </Grid>
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

let componente = VerTransaccion;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
