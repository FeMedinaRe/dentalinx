import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TablePagination from "@material-ui/core/TablePagination";
import InputLabel from "@material-ui/core/InputLabel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "Listado Pacientes/DatePickerStyles.css";

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
  inputContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: `1px solid`,
    marginRight: "20px", // Espacio a la derecha del input
    fontSize: "14px",
    color: "#777",
    outline: "none",
    "&::placeholder": {
      color: "#777",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
};


const useStyles = makeStyles(styles);

const filtro = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export default function TableList() {
  const [tableData, setTableData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      accessorKey: "rut",
      header: () => <span>Rut</span>,
    },
    {
      accessorKey: "nombre",
      header: () => <span>Nombre</span>,
    },
    {
      accessorKey: "correo",
      header: () => <span>Correo</span>,
    },
    {
      accessorKey: "iduniversidad",
      header: () => <span>Universidad</span>,
    },
    {
      accessorKey: "idcarrera",
      header: () => <span>Carrera</span>,
    },
  ];

  const [openEliminar, setOpenEliminar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/practicante");
        setTableData(response.data);
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
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filtro,
    pagination: true,
  });

  const classes = useStyles();

  const [optionUniversidad, setOptionUniversidad] = useState([]);
const [optionCarrera, setOptionCarrera] = useState([]);

  const [practicanteEdit, setPracticanteEdit] = useState({
    rut: "",
    nombre: "",
    correo: "",
    idcarrera: "",
    iduniversidad: "",
  });


  const onCambio = (e) => {
    setPracticanteEdit({
      ...practicanteEdit,
      [e.target.name]: e.target.value,
    });

  };

  const dialogEditarEliminar = (event, row) => {
    setPracticanteEdit({
      _id: row.original._id,
      rut: row.original.rut,
      nombre: row.original.nombre,
      correo: row.original.correo,
      idcarrera: row.original.idcarrera,
      iduniversidad: row.original.iduniversidad,
    });

  };

  const api = axios.create({
    baseURL: "http://localhost:3001/api/practicante",
  });

  useEffect(() => {
      const fetchData = async () => {
        try {
          var response = await axios.get("http://localhost:3001/api/practicante");
          setTableData(response.data);

          response = await axios.get("http://localhost:3001/api/carrera");
          var nuevoArreglo = response.data.map(function (elemento) {
            return {
              _id: elemento._id,
              nombre: elemento.nombre,
            };
          });
          console.log(nuevoArreglo);
          setOptionCarrera(response.data);
          console.log(optionCarrera);
          
          response = await axios.get("http://localhost:3001/api/universidad");
          setOptionUniversidad(response.data);  
          
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, []);

  const handleDeleteRow = async () => {
    try {
      axios.delete(
        `http://localhost:3001/api/deletepracticante/${practicanteEdit._id}`
      );
      window.location.reload();
    } catch (error) {
      setError("Ocurrió un error al eliminar al practicante.");
    }
  };

  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      console.log(practicanteEdit);
      const response = await axios.put(
        `http://localhost:3001/api/practicante/${practicanteEdit._id}`,
        practicanteEdit
      );

      console.log(response.data);
      setOpenEditar(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);

      console.log(practicanteEdit);
    } catch (err) {
      // Mostrar el mensaje de error con Swal.fire
      console.log(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);


  const totalPagesWithFivePerPage = Math.ceil(tableData.length / 5);
  // Crear un array de opciones de tamaño de página con múltiplos de 5 hasta llegar a la cantidad total de filas
  const availablePageSizes = Array.from(
    { length: totalPagesWithFivePerPage },
    (_, index) => (index + 1) * 5
  ).filter((size) => size <= tableData.length);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}> Practicantes</h4>
            <div> Total de Practicantes: {tableData.length} </div>
          </CardHeader>
          <CardBody>
            <div className={classes.inputContainer}>
              <TablePagination
                rowsPerPageOptions={availablePageSizes} // Opciones para el tamaño de página
                component="div"
                count={tableData.length} // Total de filas
                rowsPerPage={pageSize} // Tamaño de página actual
                page={currentPage} // Página actual
                onPageChange={(e, newPage) => setCurrentPage(newPage)} // Función para cambiar de página
                onRowsPerPageChange={(e) => {
                  setPageSize(parseInt(e.target.value, 10)); // Función para cambiar el tamaño de página
                  setCurrentPage(0); // Volver a la página 0 cuando se cambia el tamaño de página
                }}
              />
              <input
                type="text"
                placeholder="Buscar"
                onChange={(e) => setGlobalFilter(e.target.value)}
                className={classes.input}
              />
            </div>
            {/**AQUI EMPIEZA LA TABLA */}
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableCell>
                    ))}
                    <TableCell style={{ textAlign: "right" }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table
                  .getRowModel()
                  .rows.slice(
                    currentPage * pageSize,
                    (currentPage + 1) * pageSize
                  )
                  .map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      <TableCell className={classes.buttonContainer}>
                        <Button
                          color="secondary"
                          onClick={(event) => {
                            dialogEditarEliminar(event, row);
                            setOpenEliminar(true);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                        <Dialog
                          open={openEliminar}
                          onClose={() => setOpenEliminar(true)}
                        >
                          <DialogTitle>¿Está seguro de eliminar?</DialogTitle>
                          <DialogContent>
                            <Typography variant="body1">
                              Esta acción eliminará permanentemente los datos.
                            </Typography>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => {
                                setOpenEliminar(false);
                              }}
                              color="secondary"
                            >
                              Cancelar
                            </Button>
                            <Button
                              color="primary"
                              style={{ color: "white", backgroundColor: "red" }}
                              onClick={() => handleDeleteRow()}
                            >
                              Eliminar
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <Button
                          color="primary"
                          onClick={(event) => {
                            dialogEditarEliminar(event, row);
                            setOpenEditar(true);
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Dialog
                          open={openEditar}
                          onClose={() => setOpenEditar(true)}
                        >
                          <DialogTitle>Editar Practicante</DialogTitle>
                          <DialogContent>
                          <GridItem item xs={24} sm={12} md={8}>
                  <TextField
                    label="Nombre Completo"
                    id="nombre"
                    name="nombre"
                    type="text"
                    fullWidth
                    defaultValue={practicanteEdit.nombre}
                    onChange={onCambio}
                  />
                </GridItem>
                <GridItem item xs={24} sm={12} md={8}>
                  <TextField
                    label="Rut"
                    id="rut"
                    name="rut"
                    type="text"
                    onChange={onCambio}
                    defaultValue={practicanteEdit.rut}
                    fullWidth
                  />
                </GridItem>
                <GridItem xs={24} sm={12} md={8}>
                  <TextField
                    label="Correo"
                    id="correo"
                    name="correo"
                    type="text"
                    onChange={onCambio}
                    defaultValue={practicanteEdit.correo}
                    fullWidth
                  />
                </GridItem>
                <GridItem xs={24} sm={12} md={8}>
                <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">universidad</InputLabel>
                            <Select name="iduniversidad" 
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              defaultValue={practicanteEdit.iduniversidad}
                              onChange={onCambio}
                              >
                                {optionUniversidad.map((option,id) => (

                                    <MenuItem key={id} value={option.nombre}>
                                      {option.nombre}
                                    </MenuItem>)
                                )}
                            </Select>
                    </FormControl>
                </GridItem>
                <GridItem xs={24} sm={12} md={8}>
                <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Carrera</InputLabel>
                            <Select name="idcarrera" 
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              defaultValue={practicanteEdit.idcarrera}
                              onChange={onCambio}
                              >
                                {optionCarrera.map((option,id) => (
                    
                                    <MenuItem key={id} value={option.nombre}>
                                      {option.nombre}
                                    </MenuItem>)
                                )}
                            </Select>
                    </FormControl>
                </GridItem>
                            {error && (
                              <DialogContentText color="error">
                                {error}
                              </DialogContentText>
                            )}
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => {
                                setOpenEditar(false);
                                setError(null);
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={(event) => {
                                handleSubmit(event, row);
                              }}
                            >
                              Guardar
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
