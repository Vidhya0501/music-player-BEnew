
import express from 'express'
import dotenv from 'dotenv'
// import path from 'path'
import cors from 'cors'
import userRoute from './routes/userRoute.js'
import songsRoute from './routes/songsRoute.js'
import adminRoute from './routes/adminRoute.js'



dotenv.config()


const app = express();

app.use(express.json());
app.use(cors())
app.use("/api/users", userRoute);
app.use("/api/songs", songsRoute);
app.use("/api/admin", adminRoute);
const port = process.env.PORT||8000;

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/build", "index.html"));
//   });
// }

app.listen(port, () => console.log(`App is running on the PORT ${port}!`));
