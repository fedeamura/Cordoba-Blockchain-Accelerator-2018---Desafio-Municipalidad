import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import styles from './styles';
import classNames from 'classnames';
import { connect } from "react-redux";
import { push } from "connected-react-router";

import Button from "@material-ui/core/Button";
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Icon from '@material-ui/core/Icon';

import MiCard from "@Componentes/MiCard";

const mapDispatchToProps = dispatch => ({
    redireccionar: url => {
        dispatch(push(url));
    },
});

class TributarioAccess extends React.PureComponent {
    constructor(props) {
        super(props);

        this.selectOnChange = this.selectOnChange.bind(this);

        this.state = {
            opcionSeleccionada: '0',
            opcionesTributos: []
        }
    }

    componentDidMount() {
        const propsTributo = (this.props.opciones && this.props.opciones[this.props.id]) ? this.props.opciones[this.props.id] : null;
        if(propsTributo){
            this.setState({
                opcionSeleccionada: propsTributo.length > 0 ? propsTributo[0].identificador : null,
                opcionesTributos: propsTributo
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const nextPropsTributo = (nextProps.opciones && nextProps.opciones[this.props.id]) ? nextProps.opciones[this.props.id] : null;
        const propsTributo = (this.props.opciones && this.props.opciones[this.props.id]) ? this.props.opciones[this.props.id] : null;

        if(nextPropsTributo && JSON.stringify(propsTributo)!=JSON.stringify(nextPropsTributo)){
            this.setState({
                opcionSeleccionada: nextPropsTributo.length > 0 ? nextPropsTributo[0].identificador : null,
                opcionesTributos: nextPropsTributo
            });
        } else if(propsTributo){
            this.setState({
                opcionSeleccionada: propsTributo.length > 0 ? propsTributo[0].identificador : null,
                opcionesTributos: propsTributo
            });
        }
    }

    selectOnChange = event => {
        if (event.target.value == '0')
            return false;

        this.setState({
            opcionSeleccionada: event.target.value
        });
    };

    eventRedirect = () => {
        this.props.eventRedirect(this.props.tipo, this.state.opcionSeleccionada);
    };

    handleOnClickAddTributo = (event) => {
        const tributo = event.currentTarget.attributes.tributo.value;
        this.props.redireccionar('/Inicio/Representantes/'+tributo);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <MiCard
                    onClick={this.props.onClick}
                    onMouseLeave={this.onMouseLeave}
                    onMouseEnter={this.onMouseEnter}
                >
                    <CardHeader
                        className={classes.header}
                        avatar={
                            (this.props.icono && <Icon className={classes.icon}>
                                {this.props.icono}
                            </Icon>)
                            ||
                            (!this.props.icono && <div className={classes.iconSvg}>{this.props.iconoSvg}</div>)
                        }
                        action={
                            <Button 
                            variant="outlined" 
                            color="secondary" 
                            className={classNames(classes.buttonActions,classes.buttonAddTributo)}
                            tributo={this.props.tipo}
                            onClick={this.handleOnClickAddTributo}>
                                + Agregar
                            </Button>
                          }
                        title={
                            <Typography className={classes.title} variant="title">{this.props.tipo}</Typography>
                        }
                    />
                    <div className={classes.sectionInputSpacing}>
                        <InputLabel className={classes.labelInput}>{this.props.identificador}</InputLabel>
                        <Grid container spacing={0}>
                            <Grid item md={9}>
                                <Select
                                    className={classes.selectSpacing}
                                    value={this.state.opcionSeleccionada || '0'}
                                    onChange={this.selectOnChange}
                                    inputProps={{
                                        name: 'identificador',
                                        id: 'identificador',
                                    }}
                                >
                                    <MenuItem value="0">
                                        <em>{Array.isArray(this.state.opcionesTributos) && this.state.opcionesTributos.length > 0 ? 'Seleccione' : 'No se encontraron '+this.props.tipo}</em>
                                    </MenuItem>
                                    {Array.isArray(this.state.opcionesTributos) && this.state.opcionesTributos.map((data, index) => {
                                        return <MenuItem key={index} value={data.identificador}>
                                                {data.identificador}{data.representado && ' - '+data.representado}  
                                                <ListItemText secondary={"Deuda: $ "+(data.deuda ? data.deuda : '-')} />
                                            </MenuItem>
                                    })}
                                </Select>
                            </Grid>
                            <Grid item md={3} className={classes.containerButton}>
                                <Button
                                    type="enter"
                                    variant="contained"
                                    color="secondary"
                                    className={classes.buttonActions}
                                    onClick={this.eventRedirect}
                                    disabled={!(Array.isArray(this.state.opcionesTributos) && this.state.opcionesTributos.length > 0)}
                                >
                                    Entrar
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </MiCard>
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(withStyles(styles)(TributarioAccess));
