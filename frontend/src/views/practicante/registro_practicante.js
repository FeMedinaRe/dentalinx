import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import avatar from "assets/img/faces/marc.jpg";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { TextFields } from "@material-ui/icons";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ca } from "date-fns/locale";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./DatePickerStyles.css";

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



export default function RegistroPracticante() {
  const [tableData, setTableData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [suggestionsProductos, setSuggestionsProductos] = useState([]);
  const [suggestionsCategorias, setSuggestionsCategorias] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [optionUniversidad, setOptionUniversidad] = useState([]);
  const [optionCarrera, setOptionCarrera] = useState([]);
  const alphaRegex = /^[a-zA-Z\s]*$/;
  const numericRegex = /^[0-9]*$/;
  const alphaErrorMessage = "Solo se permiten letras.";
  const numericErrorMessage = "Solo se permiten números.";
  const [carreraseleccionada, setCarreraSeleccionada] = useState({
    _id:"",
    nombre:""
  });
  const [universidadseleccionada, setUniversidadSeleccionada] = useState({
    _id:"",
    nombre:""
  });
  const columns = [
    {
      accessorKey: "nombre",
      header: () => (
        <span>
          {" "}
          <b>PRODUCTO</b>{" "}
        </span>
      ),
    },
    {
      accessorKey: "rut",
      header: () => (
        <span>
          {" "}
          <b>CATEGORÍA</b>
        </span>
      ),
    },
    {
      accessorKey: "correo",
      header: () => (
        <span>
          <b>STOCK</b>
        </span>
      ),
    },
    {
      accessorKey: "carrera",
      header: () => (
        <span>
          <b>STOCK</b>
        </span>
      ),
    },
    {
      accessorKey: "universidad",
      header: () => (
        <span>
          <b>STOCK</b>
        </span>
      ),
    },
  ];
  const api = axios.create({
    baseURL: "http://localhost:3001/api/practicante",
  });

  useEffect(() => {
      const fetchData = async () => {
        try {
          var response = await axios.get("http://localhost:3001/api/practicante");
          setTableData(response.data);

          response = await axios.get("http://localhost:3001/api/carrera");
          var carreras = [
            ...new Set(response.data.map((item) => item.nombre)),
          ];
          setOptionCarrera(carreras); 

          response = await axios.get("http://localhost:3001/api/universidad");
          var universidades = [
            ...new Set(response.data.map((item) => item.nombre)),
          ];
          setOptionUniversidad(universidades);  
          
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, []);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { globalFilter, pageIndex: currentPage, pageSize },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const classes = useStyles();
  const [values, setValues] = useState({
    nombre: "",
    rut: "",
    correo: "",
    universidad: "",
    carrera: "",
  });


  const Create = async () => {
    
    try {
      const response = await api.post(`/`, values);
      setValues(false);
      setTimeout(() => {
        window.location.reload();
      });
    } catch (err) {
      setError("Ocurrió un error al actualizar practicante.");
    }
  };


  const handleUniversidad = (e) => {
    const { name, value } = e.target;
    setUniversidadSeleccionada({ ...universidadseleccionada, [name]: value });
    setValues({ ...universidadseleccionada, [name]: value }); 
  };
  const handleCarrera = (e) => {
    const { name, value } = e.target;
    setCarreraSeleccionada({ ...carreraseleccionada, [name]: value });
    setValues({ ...universidadseleccionada, [name]: value }); 
  };  


  const onChange = (e) => {
    e.preventDefault();

    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
  };

  const universidad = async (e) => {
    try{
      const response = await axios.get(
        "http://localhost:3001/api/universidad",
        values
      );
    }catch (err) {
      setError("Ocurrió un error al actualizar universidad.");
    }
  }
  const carrera = async (e) => {
    try{
      const response = await axios.get(
        "http://localhost:3001/api/carrera",
        values
      );
    }catch (err) {
      setError("Ocurrió un error al actualizar carrera.");
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(values);

    try {

      const response = await axios.post(
        "http://localhost:3001/api/practicante",
        values
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Practicante Guardado",
          text: "El practicante ha sido guardado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    } catch (err) {
      // Mostrar el mensaje de error con Swal.fire
      console.log(err.response.data.message);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.message,
      });
    }
  };
  //const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={11}>
          <Card>
            <CardHeader color="primary" position="relative">
              <h4 className={classes.cardTitleWhite}>Registar Practicante</h4>
            </CardHeader>
            <CardBody>
              <Box display="flex" height="100%" marginTop={3}>
                <GridItem item xs={12} sm={6} md={4}>
                  <TextField
                    label="Nombre Completo"
                    id="nombre"
                    type="text"
                    fullWidth
                    onChange={onChange}
                  />
                </GridItem>
                <GridItem item xs={12} sm={6} md={4}>
                  <TextField
                    label="Rut"
                    id="rut"
                    type="text"
                    onChange={onChange}
                    fullWidth
                  />
                </GridItem>
              </Box>
              <Box display="flex" height="100%" marginTop={5}>
                <GridItem xs={12} sm={12} md={4}>
                  <TextField
                    label="Correo"
                    id="correo"
                    type="text"
                    onChange={onChange}
                    fullWidth
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">universidad</InputLabel>
                            <Select name="iduniversidad" 
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              defaultValue = ""
                              onChange={handleUniversidad}
                              >
                                {optionUniversidad.map((option,id) => (

                                    <MenuItem key={id} value={option}>
                                      {option}
                                    </MenuItem>)
                                )}
                            </Select>
                    </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Carrera</InputLabel>
                            <Select name="idcarrera" 
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              defaultValue = ""
                              onChange={handleCarrera}
                              >
                                {optionCarrera.map((option,id) => (

                                    <MenuItem key={id} value={option}>
                                      {option}
                                    </MenuItem>)
                                )}
                            </Select>
                    </FormControl>
                </GridItem>
              </Box>
              <Box display="flex" height="100%" marginTop={3}></Box>
              <Box display="flex" height="100%" marginTop={3}>
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
