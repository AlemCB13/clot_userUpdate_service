require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Importar rutas
const userRoutes = require("./routes/index");
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Microservicio de Actualizar Usuario corriendo en el puerto ${PORT}`);
});
