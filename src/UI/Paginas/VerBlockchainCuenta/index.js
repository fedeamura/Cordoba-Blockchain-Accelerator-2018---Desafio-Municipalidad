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

import Rules_Account from "@Rules/Rules_Account";

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

class VerBlockchainCuenta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      data: [],
      address: this.props.match.params.address
    };
  }

  componentDidMount() {
    this.buscar();
  }

  buscar = () => {
    this.setState({ cargando: true }, () => {
      Rules_Account.getByAddress(this.state.address)
        .then(data => {
          console.log(data);
          this.setState({
            data: data,
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

  hex2a = hexx => {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  };

  verIPFS = t => {
    this.props.redireccionar("/VerIPFS/" + t);
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiPagina cargando={this.state.cargando}>
            <MiContent>
              <Typography variant="display1">Address</Typography>
              <Typography variant="body2">{this.state.address}</Typography>
              <div style={{ height: "16px" }} />
              {this.state.data.map((x, index) => {
                return <Item key={index} data={x} onIPFS={this.verIPFS} />;
              })}

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

class Item extends React.PureComponent {
  onIPFS = () => {
    let hash = this.props.data.message.payload;
    this.props.onIPFS(this.hex2a(hash));
  };

  hex2a = hexx => {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  };

  render() {
    let { data } = this.props;
    return (
      <React.Fragment>
        <MiCard>
          {data && <ReactJson displayDataTypes={false} src={data} />}

          {data &&
            data.message && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={this.onIPFS}
              >
                Abrir IPFS
              </Button>
            )}
        </MiCard>
        <div style={{ height: "16px" }} />
      </React.Fragment>
    );
  }
}
let componente = VerBlockchainCuenta;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
