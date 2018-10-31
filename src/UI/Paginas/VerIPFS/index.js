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

//Rules
import Rules_IPFS from "@Rules/Rules_IPFS";
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

class VerIPFS extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      ipfsData: undefined,
      hash: this.props.match.params.hash
    };
  }

  componentDidMount() {
    this.buscar();
  }

  buscar = () => {
    this.setState({ cargando: true }, () => {
      Rules_IPFS.leer(this.state.hash)
        .then(dataIPFS => {
          dataIPFS = JSON.parse(dataIPFS);

          let dataIPFSOrdenado = {};
          Object.keys(dataIPFS)
            .sort()
            .forEach(function(key) {
              dataIPFSOrdenado[key] = dataIPFS[key];
            });
          dataIPFS = dataIPFSOrdenado;

          this.setState({
            ipfsData: dataIPFS,
            cargando: false
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
                  <MiCard titulo={`IPFS`}>
                    <Typography variant="caption">
                      HASH: {this.state.hash}
                    </Typography>
                    <div style={{ height: "16px" }} />
                    {this.state.ipfsData && (
                      <ReactJson
                        src={this.state.ipfsData}
                        displayDataTypes={false}
                      />
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

let componente = VerIPFS;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
