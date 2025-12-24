import express from "express";
import userRouter from "./routes/user.routes.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";
const app = express();
const PORT = process.env.PORT ?? 8000;


app.use(express.json());

app.use(authenticationMiddleware)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use('/user', userRouter)
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});