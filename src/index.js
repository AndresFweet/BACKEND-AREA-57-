import app from "./app.js"
import { PORT } from "./config.js"
//conexion BD
import { connectDB } from "./db.js";
//ejecutar conexionBD
connectDB()
app.listen(PORT)
console.log(`Server on port`, PORT);
