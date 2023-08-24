const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"127.0.0.1",
    user: "root",
    password: "asd",
    database: "ssa2"
});

app.post("/create",(req,res)=>{
    const asiento = req.body.asiento;
    const fecha = req.body.fecha;
    const descripcion = req.body.descripcion;
    const cuenta = req.body.cuenta;

    db.query('INSERT INTO asientos(asiento,descripcion,fecha,cuenta) VALUES (?,?,?,?)',[asiento,descripcion,fecha,cuenta],
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send("Asiento registrado con exito!");
        }
    }
    );
});

app.get("/asientos",(req,res)=>{
    db.query('SELECT * FROM asientos',
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.post("/crearCuenta",(req,res)=>{
    const cuenta = req.body.cuenta;
    db.query('INSERT INTO cuentasregistro(cuenta) VALUES (?)',[cuenta],
    (err,result)=>{
        if (err){
            res.status(500).send("Error al insertar la cuenta.");
        }else{
            res.send("Asiento registrado con exito!");
        }
    }
    );
});

app.get("/cuentas",(req,res)=>{
    db.query('SELECT * FROM cuentasregistro',
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.put("/actualizar",(req,res)=>{
    const id = req.body.id;
    const asiento = req.body.asiento;
    const fecha = req.body.fecha;
    const descripcion = req.body.descripcion;

    db.query('UPDATE asientos SET asiento=?,descripcion=?,fecha=? WHERE id=?',[asiento,descripcion,fecha,id],
    (err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send("Asiento actualizado");
        }
    }
    );
});

// Ruta para validar datos de inicio de sesión
app.post('/login', (req, res) => {
    const usuario = req.body.usuario;
    const contrasenia = req.body.contrasenia;
  
    if (!usuario || !contrasenia) {
      res.status(400).json({ message: 'Campos incompletos' });
      return;
    }
    // Consulta a la base de datos para validar los datos
    db.query("SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?", [usuario, contrasenia], 
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el servidor' });
      } else if (results.length === 0) {
        res.status(401).json({ message: 'Credenciales inválidas' });
      } else {
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
      }
    });
  });

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001")
})