const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mysql = require("mysql");

const app = express();
const port = process.env.PORT;
// app.get("/", (req, res) => {
//   res.send("Hello");
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port);

//mysql
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "student",
});
app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * FROM studentdata", (err, rows) => {
      connection.release(); //return connection to the pool
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    });
  });
});

app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT * FROM studentdata WHERE id = ${req.params.id}`,
      (err, rows) => {
        connection.release(); //return connection to the pool
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
      }
    );
  });
});

app.delete("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `DELETE FROM studentdata WHERE id = ${req.params.id}`,
      (err, rows) => {
        connection.release(); //return connection to the pool
        if (!err) {
          res.send(`Record deleted with id : ${req.params.id}`);
        } else {
          console.log(err);
        }
      }
    );
  });
});
app.post("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const params = req.body;
    connection.query("INSERT INTO studentdata SET ? ", params, (err, rows) => {
      connection.release(); //return connection to the pool
      console.log(rows);
      if (!err) {
        res.send(`Record inserted with id : ${rows.insertId}`);
      } else {
        console.log(err);
      }
    });
  });
});
app.put("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const { id, name, address, image } = req.body;
    connection.query(
      "UPDATE studentdata SET name= ? , image=? , address=?  WHERE id = ? ",
      [name, image, address, id],
      (err, rows) => {
        connection.release(); //return connection to the pool
        console.log(rows);
        if (!err) {
          res.send(`Record updated with id : ${id}`);
        } else {
          console.log(err);
        }
      }
    );
  });
});
