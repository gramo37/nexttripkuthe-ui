import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { deleteExpense, getAllExpenses } from "../../utils/api";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { formatDate } from "../../utils/common";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles({
  button_container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
  },
  button_link: {
    padding: "10px",
    backgroundColor: "#5ca0d4",
    color: "white",
    fontSize: "16px",
    borderRadius: "5px",
    textDecoration: "none",
    transition: "0.5s",
    "&:hover": {
      scale: 1.1,
    },
  },
  closeButton: {
    cursor: "pointer",
  },
});

const Home = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getExpenses = () => {
    getAllExpenses()
      .then((res) => {
        console.log(res);
        if (res?.success) setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setData([]);
        setIsLoading(false);
      });
  };

  const deleteCurrentExpense = async (expense_id) => {
    console.log(expense_id);
    deleteExpense({ expense_id })
      .then((res) => {
        console.log(res);
        if (res?.success) {
          alert(res?.data);
          getExpenses();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getExpenses();
  }, []);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Expenses of the trip
      </Typography>
      {data?.length >0 ? <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>EXPENSE REASON</TableCell>
              <TableCell>TOTAL MONEY PAID</TableCell>
              <TableCell>CREATE AT</TableCell>
              <TableCell>DELETE ROW</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? data?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : data
            ).map((row) => (
              <TableRow key={row.expense_id}>
                <TableCell>{row.reason}</TableCell>
                <TableCell>{row.money_paid} Rs</TableCell>
                <TableCell>{formatDate(row.created_at)}</TableCell>
                <TableCell>
                  <Box
                    className={classes.closeButton}
                    onClick={(id) => {
                      deleteCurrentExpense(row.expense_id);
                    }}
                  >
                    <CloseIcon />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>: <h2 style={{textAlign: "center"}}>No Expenses to display!</h2>}
      <Box className={classes.button_container}>
        <Button className={classes.button}>
          <Link to="/show-all-transactions" className={classes.button_link}>
            Show Transactions
          </Link>
        </Button>
        <Button className={classes.button}>
          <Link to="/add-expense" className={classes.button_link}>
            Add Expense
          </Link>
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
