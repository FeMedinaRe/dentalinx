import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

const TableList = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [values, setValues] = useState({
    rut: "",
    nombre: "",
    edad: "",
    saldo: "",
  });

  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/paciente",
        values
      );
      console.log(response.data);

      if (response.status === 201) {
        Swal.fire({
          title: "Paciente Guardado",
          text: "El paciente ha sido guardado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error al Guardar",
        text: "Hubo un error al guardar al paciente.Inténtalo nuevamente",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/pacientes");
        setTableData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <GridContainer>
      <Button color="primary" variant="outlined" onClick={handleClickOpen}>
        Registrar Paciente
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nuevo Paciente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            type="String"
            fullWidth
            variant="standard"
            onChange={onChange}
            name="nombre"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Edad"
            type="Number"
            fullWidth
            variant="standard"
            onChange={onChange}
            name="edad"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Rut"
            type="String"
            fullWidth
            variant="standard"
            onChange={onChange}
            name="rut"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Saldo"
            type="Number"
            fullWidth
            variant="standard"
            onChange={onChange}
            name="saldo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Pacientes</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Rut", "Nombre", "Edad", "Saldo"]}
              tableData={tableData.map((paciente) => [
                paciente.rut,
                paciente.nombre,
                paciente.edad,
                paciente.saldo,
              ])}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

export default TableList;
