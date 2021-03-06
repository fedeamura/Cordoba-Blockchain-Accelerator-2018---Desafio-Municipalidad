import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Alert
import { mostrarAlerta } from "@Utils/functions";

import { Typography } from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";

import MiControledDialog from "@Componentes/MiControledDialog";

import services from '@Rules/Rules_TributarioOnline';
import { mostrarCargando } from '@Redux/Actions/mainContent';

const mapStateToProps = state => {
  return {
    loggedUser: state.MainContent.loggedUser
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  },
});

class MiCedulon extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      base64Cedulon: '',
      disabled: true
    };
  }

  componentWillReceiveProps(nextProps) {

    if (JSON.stringify(this.props.disabled) != JSON.stringify(nextProps.disabled)) {
      this.setState({
        disabled: nextProps.disabled
      });
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  onBotonCedulonClick = (event) => {
    this.setState({
      anchorEl: null,
    });

    this.props.mostrarCargando(true);
    const registros = this.props.registrosSeleccionados;
    const token = this.props.loggedUser.token;
    const opcion = event.currentTarget.attributes.opcion.value;
    if (registros.length > 0) {
      services.getReporteCedulon(token,
        {
          "tipoTributo": parseInt(this.props.tipoTributo),
          "identificador": this.props.identificador,
          "opcionVencimiento": parseInt(opcion),
          "periodos": registros
        })
        .then((datos) => {
          if (!datos.ok) { mostrarAlerta(datos.error); this.props.mostrarCargando(false); return false; }
          
          this.setState({
            base64Cedulon: datos.return ? 'data:application/pdf;base64,' + datos.return : '',
            dialogoOpen: true
          });
        })
        .catch((err) => { console.log(err); })
        .finally(() => {
          this.props.mostrarCargando(false);
        });
    } else {
      this.setState({
        base64Cedulon: '',
        dialogoOpen: true
      });
      this.props.mostrarCargando(false);
    }
  }

  onDialogoOpen = () => {
    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.setState({ dialogoOpen: false });
  }

  render() {
    let { classes } = this.props;

    return (
      <div className={classes.root}>
        <MiControledDialog
          open={this.state.dialogoOpen}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          buttonAction={true}
          textoLink={'Cedulon'}
          titulo={'Cedulon'}
        >
          <div key="buttonAction">
            <Button
              variant="contained"
              color="secondary"
              className={classes.buttonActions}
              onClick={this.handleClick}
              disabled={this.state.disabled}
            >
              CEDULÓN
          <Typography className={classes.buttonActionsCaption} variant="caption" gutterBottom align="center">
                Pago Efectivo
          </Typography>
            </Button>
            <Menu
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.onBotonCedulonClick} opcion="1">Hoy</MenuItem>
              <MenuItem onClick={this.onBotonCedulonClick} opcion="2">A Días</MenuItem>
            </Menu>
          </div>

          <div key="mainContent">
            {this.state.base64Cedulon != '' && <iframe src={this.state.base64Cedulon} height="410px" width="856px"></iframe>}
            {this.state.base64Cedulon == '' && 'Debe seleccionar algún concepto'}
          </div>
        </MiControledDialog>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    display: 'inline-block'
  },
  buttonActions: {
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px',
  },
  buttonActionsCaption: {
    top: '40px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90px'
  },
});

let componente = MiCedulon;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;