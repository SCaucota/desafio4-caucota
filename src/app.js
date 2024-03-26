import express from "express";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./controllers/productManager.js";
const app = express();
const PUERTO = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());

app.set("view engine", "handlebars");

app.set("views", "./src/views");

app.use("/", viewsRouter);
app.use("/api", productsRouter);
app.use("/api", cartsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto http//localhost:${PUERTO}`)
    
})

const io = new Server(httpServer);
const productManager = new ProductManager;

io.on("connection", async (socket) => {
    console.log("Un cliente se conecto");

    socket.emit("products", await productManager.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);

        socket.emit("products", await productManager.getProducts());
    });

    socket.on("addProduct", async (product) => {
        const {title, description, code, price, img, status, stock, category} = product;
        await productManager.addProduct(title, description, code, price, img, status, stock, category);
        socket.emit("products", await productManager.getProducts());
    })

});
