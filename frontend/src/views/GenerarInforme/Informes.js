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
//import InputLabel from '@mui/material/InputLabel';
//import Select, { SelectChangeEvent } from '@mui/material/Select';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
import axios from "axios";
//import Dialog from "@material-ui/core/Dialog";
//import DialogActions from "@material-ui/core/DialogActions";
//import DialogContent from "@material-ui/core/DialogContent";
//import DialogTitle from "@material-ui/core/DialogTitle";
//import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import TablePagination from "@material-ui/core/TablePagination";
//import Typography from "@material-ui/core/Typography";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Button, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';
//Para importa PDF

//import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'; // NO FUNCIONAL


// Estilos de la página
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover": {
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
    marginRight: "20px", 
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

// Aplicamos los estilos
const useStyles = makeStyles(styles);

// Para aplicar filtro de búsqueda
const filtro = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export default function TableList() {
  const [tableData, setTableData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(99);
  const [currentPage, setCurrentPage] = useState(0);


// para flitro por rango de fechas
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [citasFiltradas, setCitasFiltradas] = useState(tableData.length);


// para verificar el monto de lo que se puede recaudar
  const [cantidadDineroTotal, setDineroTotal] = useState([]);

  // Campos de la tabla
  const columns = [
    // {
    //   accessorKey: "_id",
    //   header: () => <span>Id Cita</span>,
    // },
    {
      accessorKey: "paciente_id",
      header: () => <span>Nombre Paciente</span>,
    },
    {
      accessorKey: "dentista_id",
      header: () => <span>Dentista</span>,
    },
    {
      accessorKey: "tratamiento_id",
      header: () => <span>Tratamiento</span>,
    },
    {
      accessorKey: "fecha",
      header: () => <span>Fecha</span>,
    },
    {
      accessorKey: "hora",
      header: () => <span>Hora</span>,  
    },
    {
      accessorKey: "estado",
      header: () => <span>Estado</span>,
    },
  ];

  

  //Conexión a la base de datos, se realiza la solicitud HTTP al servidor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/citas");

        response.data.map((option) => (
          option.fecha = new Date(option.fecha).toLocaleDateString('es-ES')
        )
        )
        setTableData(response.data);

          
          // para ver cuanto dinero se recauda

          const responseTratamientos = await axios.get("http://localhost:3001/api/citaTratamientos");

          const fetchedSaldoTratamiento  = [
            ...new Set(responseTratamientos.data.map((item) => item.saldo)),
          ];
          setOptionTratamiento(fetchedSaldoTratamiento);


          // Para el calculo de la cantidad de citas filtradas
          const citasFiltradas = tableData.filter(filtrarCitas).length;
          setCitasFiltradas(citasFiltradas);



      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [tableData,fechaInicio,fechaFin]);

  // Como se comportan las tablas
  const table = useReactTable({
    data: tableData,
    columns,
    state: { globalFilter, pageIndex: currentPage, pageSize
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Para aplicar los estilos 
  const classes = useStyles();

  const inputDateStyles = {
    width: '99%',
    height: '30px',
    fontSize: '16px',
    padding: '5px 0px 5px 5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const buttonStyle = {
    backgroundColor: hovered ? '#056974' : '#00acc1',
    border: '1px solid #00acc1',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    cursor: 'pointer',
    float: 'left',
    marginRight: '5px',
    borderRadius: '5px',
    };



  
  
// funcion para filtrar citas por rango de fechas
  const filtrarCitas = (row) => {
    const fechaCita = moment(row.original.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const fechaInicioValida = !fechaInicio || fechaCita >= fechaInicio;
    const fechaFinValida = !fechaFin || fechaCita <= fechaFin;
    return fechaInicioValida && fechaFinValida;
  };

  




  const [error, setError] = useState(null);

  

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
          <h2 className={classes.cardTitleWhite}> Informe Clinica</h2>
            <h4 className={classes.cardTitleWhite}> Citas Agendadas</h4>
            <div> Total de citas agendadas: {tableData.length} </div>  {/*ARREGLAR PARA EL REPORTE, YA QUE APARECEN LA CANTIDAD DE CITAS TOTALES ALMACENADAS EN LA BD */}
          </CardHeader>
          <CardBody>
            <div className={classes.inputContainer}>

            

              
                                                    {/*SECCION PARA FILTRAR POR RANGOS DE FECHAS */}
              <Grid item xs={5}>
                <TextField
                  id="fecha-inicio"
                  label="Fecha de inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={5} >
                <TextField
                  id="fecha-fin"
                  label="Fecha de fin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              
              
            </div>
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
                    
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
              {table
                  .getRowModel()
                  .rows.slice(
                    currentPage * pageSize,
                    (currentPage + 1) * pageSize)
                  .filter(filtrarCitas)
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