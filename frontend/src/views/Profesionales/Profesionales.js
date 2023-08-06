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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

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
/*
const filtro = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};
*/
export default function TableList() {
  const [tableData, setTableData] = useState([]);
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
      accessorKey: "edad",
      header: () => <span>Edad</span>,
    },
    {
      accessorKey: "especialidad",
      header: () => <span>Especialidad</span>,
    },
    {
      accessorKey: "correo",
      header: () => <span>Correo</span>,
    },
    {
      accessorKey: "direccion",
      header: () => <span>Direccion</span>,
    },
  ];

  const [openEliminar, setOpenEliminar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/profesionales`);
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pagination: true,
  });

  const classes = useStyles();

  const [profesionalEdit, setProfesionalEdit] = useState({
    direccion: "",
    edad: "",
    especialidad: "",
  });

  const onCambio = (e) => {
    setProfesionalEdit({
      ...profesionalEdit,
      [e.target.name]: e.target.value,
    });
  };

  const dialogEditarEliminar = (event, row) => {
    //console.log(row.original.nombre);
    setProfesionalEdit({
      _id: row.original._id,
      rut: row.original.rut,
      nombre: row.original.nombre,
      edad: row.original.edad,
      especialidad: row.original.especialidad,
      direccion: row.original.direccion,
      correo: row.original.correo
    });
  };

  const handleDeleteRow = async () => {
    try {
      axios.delete(`http://localhost:3001/api/deleteProfesional/${profesionalEdit._id}`
      );
      window.location.reload();
    } catch (error) {
      setError("Error al eliminar al profesional.");
    }
  };

  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    console.log(profesionalEdit);

    try {
      const response = await axios.put(`http://localhost:3001/api/profesional/${profesionalEdit._id}`,profesionalEdit);

      console.log(response.data);
      setOpenEditar(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);

      console.log(profesionalEdit);
    } catch (err) {
      // Mostrar el mensaje de error con Swal.fire
      console.log(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}> Profesionales</h4>
            <div> Total de Profesionales: {tableData.length} </div>
          </CardHeader>
          <CardBody>
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
                {table.getRowModel().rows.map((row) => (
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
                        <DialogTitle>Editar Profesional</DialogTitle>
                        <DialogContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                variant="outlined"
                                defaultValue={profesionalEdit.nombre}
                                disabled
                                InputProps={{
                                  style: { color: "black" }, // Cambiar el color del texto a negro
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Rut"
                                name="rut"
                                variant="outlined"
                                defaultValue={profesionalEdit.rut}
                                disabled
                                InputProps={{
                                  style: { color: "black" }, // Cambiar el color del texto a negro
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Dirección"
                                name="direccion"
                                variant="outlined"
                                defaultValue={profesionalEdit.direccion}
                                onChange={onCambio}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Edad"
                                name="edad"
                                variant="outlined"
                                defaultValue={profesionalEdit.edad}
                                onChange={onCambio}
                              />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Especialidad"
                                name="especialidad"
                                variant="outlined"
                                defaultValue={profesionalEdit.especialidad}
                                onChange={onCambio}
                              />
                            </Grid>
                          </Grid>
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
