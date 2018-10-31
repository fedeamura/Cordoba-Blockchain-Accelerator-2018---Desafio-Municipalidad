import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { Typography } from "../../../../node_modules/@material-ui/core";

class Dialogo_NuevaCuenta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mostrar: false
    };
  }

  onMostrarClick = () => {
    this.setState({ mostrar: !this.state.mostrar });
  };

  render() {
    let { fullScreen, cuenta } = this.props;
    cuenta = cuenta || {};
    let { address, privateKey, publicKey, wlt } = cuenta;

    if (this.state.mostrar == false) {
      privateKey = "***********************";
      wlt = "***********************";
    }

    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.props.open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Requerimiento creado correctamente
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Usted puede hacer su seguimiento a traves de este sistema o a traves
            de la cuenta Blockchain asociada
          </Typography>
          <Typography variant="body1">
            Le recomendamos que almacene de forma segura los datos de la cuenta
          </Typography>

          <div style={{ height: "16px" }} />
          <Typography variant="subheading">Datos de la cuenta</Typography>
          <Typography variant="body2">Address</Typography>
          <Typography variant="body1">{address}</Typography>
          <Typography variant="body2">Public Key</Typography>
          <Typography variant="body1">{publicKey}</Typography>
          <Typography variant="body2">Private Key</Typography>
          <Typography variant="body1">{privateKey}</Typography>
          <Typography variant="body2">WLT</Typography>
          <Typography variant="body1">{wlt}</Typography>

          <div style={{ height: "16px" }} />

          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={this.onMostrarClick}
          >
            Mostrar datos privados
          </Button>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={this.props.onBotonAceptarClick}
            color="secondary"
            autoFocus
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(Dialogo_NuevaCuenta);
