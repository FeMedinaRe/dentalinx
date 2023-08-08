import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";


const styles = {
cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
},
cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
},
};

const useStyles = makeStyles(styles);

export default function Profesional() {
const [values, setValues] = useState({
    rut:"",
    nombre:"",
    direccion: "",
    especialidad:"",
    correo:"",
    sexo:""
});

const updateSelect = (e) => {
    values.sexo = e.target.value;
};

const onChange = (e) => {
    e.preventDefault();

    setValues({
    ...values,
    [e.target.id]: e.target.value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();


    try {
    const response = await axios.post(
        "http://localhost:3001/api/profesional",
        values
    );

    if (response.status === 201) {
        Swal.fire({
        title: "Profesional Guardado",
        text: "El profesional ha sido guardado exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        });
        setTimeout(() => {
        window.location.reload();
        }, 2500);
    }
    } catch (err) {

    Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.message,
    });
    }
};
const classes = useStyles();
return (
    <div>
    <GridContainer>
        <GridItem xs={12} sm={12} md={11}>
        <Card>
            <CardHeader color="primary" position="relative">
            <h4 className={classes.cardTitleWhite}>Guardar Profesional</h4>
            </CardHeader>
            <CardBody>
            <Box display="flex" height="100%" marginTop={3}>
                <GridItem item xs={12} sm={6} md={4}>
                <TextField
                    label="Rut"
                    id="rut"
                    type="text"
                    fullWidth
                    onChange={onChange}
                />
                </GridItem>
                <GridItem item xs={12} sm={6} md={4}>
                <TextField
                    label="Nombre"
                    id="nombre"
                    type="text"
                    onChange={onChange}
                    fullWidth
                />
                </GridItem>
            </Box>
            <Box display="flex" height="100%" marginTop={5}>
                <GridItem xs={12} sm={12} md={4}>
                <TextField
                    label="Direccion"
                    id="direccion"
                    type="text"
                    onChange={onChange}
                    fullWidth
                />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                <TextField
                    label="Especialidad"
                    id="especialidad"
                    type="text"
                    onChange={onChange}
                    fullWidth
                />
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                <InputLabel>Sexo</InputLabel>
                <Select label="Sexo" onChange={updateSelect}>
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Femenino">Femenino</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                </Select>
                </GridItem>
            </Box>
            <Box display="flex" height="100%" marginTop={3}>
            <GridItem xs={12} sm={12} md={4}>
                <TextField
                    label="Correo"
                    id="correo"
                    type="text"
                    onChange={onChange}
                    fullWidth
                />
                </GridItem>
            </Box>
            </CardBody>
            <CardFooter>
            <Button color="primary" onClick={handleSubmit}>
                Guardar
            </Button>
            </CardFooter>
        </Card>
        </GridItem>
    </GridContainer>
    </div>
);
}
