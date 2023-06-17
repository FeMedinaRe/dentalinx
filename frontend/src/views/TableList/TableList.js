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
import TextField from "@material-ui/core/TextField";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Button } from "@material-ui/core";
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
      accessorKey: "edad",
      header: () => <span>Edad</span>,
    },
    {
      accessorKey: "saldo",
      header: () => <span>Saldo</span>,
    },
  ];

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

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filtro,
  });

  const classes = useStyles();

  const handleDeleteRow = async (event, rowID) => {
    console.log(rowID.original._id);
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/deletePaciente/${rowID.original._id}`
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Pacientes</h4>
          </CardHeader>
          <CardBody>
            <div className={classes.inputContainer}>
              <input
                type="text"
                placeholder="Buscar"
                onChange={(e) => setGlobalFilter(e.target.value)}
                className={classes.input}
              />
            </div>
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
                        onClick={(event) => handleDeleteRow(event, row)}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button color="primary">
                        <EditIcon />
                      </Button>
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
