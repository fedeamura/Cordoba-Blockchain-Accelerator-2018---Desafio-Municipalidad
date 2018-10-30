import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

//Compontes
import _ from "lodash";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { Typography, Grid, Card, CardContent } from "@material-ui/core";
import MD5 from "crypto-js/md5";
import * as firebase from "firebase";

import {
  SimpleWallet,
  Password,
  AccountHttp,
  Address,
  TransactionHttp,
  Account,
  TransferTransaction,
  TimeWindow,
  XEM,
  EmptyMessage,
  PlainMessage
} from "nem-library";

//Mis Componentes
import MiToolbar from "@Componentes/MiToolbar";
import MiContent from "@Componentes/MiContent";
import MiBanerError from "@Componentes/MiBanerError";
import Cloudinary from "@Componentes/_Cloudinary";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    cargando: state.MainContent.cargando
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      error: undefined,
      mostrarError: false,
      curriculums: []
    };
  }

  componentDidMount() {
    this.buscarDatos();
  }

  buscarDatos = () => {
    var db = firebase.firestore();
    db.collection("usuarios")
      .doc(this.props.usuario.id)
      .onSnapshot(
        docData => {
          docData = docData.data();
          let curriculums = docData.curriculums;
          this.setState({ curriculums: curriculums });
        },
        ({ message }) => {
          alert(message);
        }
      );

    // const accountHttp = new AccountHttp([{ domain: "104.128.226.60" }]);
    // accountHttp
    //   .allTransactions(new Address(this.props.usuario.address))
    //   .subscribe(
    //     allTransactions => {
    //       console.log(allTransactions);
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
  };

  onFiles = e => {
    let files = e.currentTarget.files;
    if (files.length == 0) return;

    this.setState({ cargando: true }, () => {
      Cloudinary.subir(files[0]).then(url => {
        var reader = new FileReader();
        reader.onload = event => {
          var binary = event.target.result;
          var md5 = MD5(binary).toString();

          const transactionHttp = new TransactionHttp([
            { domain: "104.128.226.60" }
          ]);
          const account = Account.createWithPrivateKey(
            this.props.usuario.privateKey
          );

          let fecha = new Date().getTime();
          const transferTransaction = TransferTransaction.create(
            TimeWindow.createWithDeadline(),
            new Address(this.props.usuario.address),
            new XEM(0),
            PlainMessage.create(`C_${md5}|${url}|${fecha}`)
          );

          console.log("Transaccion");
          console.log(transferTransaction);

          const signedTransaction = account.signTransaction(
            transferTransaction
          );

          transactionHttp
            .announceTransaction(signedTransaction)
            .toPromise()
            .then(data => {
              console.log(data);

              let curriculum = {
                fecha: new Date().getTime(),
                md5: md5,
                url: url,
                address: this.props.usuario.address,
                transacctionHash: data.transactionHash.data
              };

              var db = firebase.firestore();
              db.collection("usuarios")
                .doc(this.props.usuario.id)
                .get()
                .then(docUser => {
                  docUser = docUser.data();
                  let curriculums = docUser.curriculums || [];
                  curriculums.push(curriculum);

                  db.collection("usuarios")
                    .doc(this.props.usuario.id)
                    .update({
                      curriculums: curriculums
                    })
                    .then(() => {})
                    .catch(({ message }) => {
                      this.setState({ cargando: false });
                      alert(message);
                    });
                })
                .catch(({ message }) => {
                  this.setState({ cargando: false });
                  alert(message);
                });
            })
            .catch(({ message }) => {
              this.setState({ cargando: false });
              alert(message);
            });
        };
        reader.readAsBinaryString(files[0]);
      });
    });
  };

  render() {
    const { classes, usuario } = this.props;
    if (usuario == undefined) return null;

    const urlPdf =
      "https://www.thedataschool.co.uk/wp-content/uploads/2017/11/pdf-2127829_960_720.png";

    return (
      <React.Fragment>
        <div className={classes.root}>
          {/* Toolbar */}
          <MiToolbar
            titulo={"Inicio"}
            cargando={this.state.cargando}
            className={classes.toolbar}
          />

          {/* Contenido */}
          <div className={classNames(classes.main)}>
            <div className={classes.separadorToolbar} />
            <div className={classes.content}>
              <MiContent className={classes.content}>
                <MiBanerError
                  visible={this.state.mostrarError}
                  mensaje={this.state.error}
                />

                <Typography variant="subheading">Subir curriculum</Typography>
                <input type="file" onChange={this.onFiles} />

                {this.state.curriculums &&
                  this.state.curriculums.length != 0 && (
                    <React.Fragment>
                      <div style={{ marginTop: "32px" }} />
                      <Typography variant="subheading">
                        Curriculumns subidos
                      </Typography>
                      {this.state.curriculums.map((curriculum, index) => {
                        let { fecha, md5, url } = curriculum;

                        return (
                          <Card key={index} className={classes.cardCurriculum}>
                            <CardContent
                              className={classes.cardContentCurriculum}
                            >
                              <div
                                className={classes.imagenCurriculum}
                                style={{ backgroundImage: `url(${urlPdf})` }}
                              />

                              <div className={classes.textosCurriculum}>
                                <Typography
                                  variant="body2"
                                  href={url}
                                  style={{
                                    textDecoration: "underline",
                                    cursor: "pointer"
                                  }}
                                >
                                  {url}
                                </Typography>
                                <Typography variant="body1">
                                  HASH: {md5}
                                </Typography>
                                <Typography variant="body1">
                                  Fecha: {JSON.stringify(fecha)}
                                </Typography>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </React.Fragment>
                  )}
              </MiContent>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            classes.contentOverlayCargando,
            this.state.cargando == true && classes.contentOverlayCargandoVisible
          )}
        />
      </React.Fragment>
    );
  }
}

let componente = undefined;
componente = withStyles(styles)(App);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
