import express from "express";
import CartManager from "../controllers/cartManager.js";
import ProductManager from "../controllers/ProductManager.js";
const router = express.Router();
const cartManager = new CartManager;
const productManager = new ProductManager;

router.get("/carts/:cid", async (req, res) => {
    try{
        let id = parseInt(req.params.cid)

        const selectedCart = await cartManager.getCartProducts(id)

        if(selectedCart) {
            res.send(selectedCart);
        }else {
            res.status(404).send({ error: `El carrito de ID ${id} no existe` });;
        }

    }catch (error) {
        console.log(error);
        res.send("Error al obtener el carrito requerido");
    }
});

router.post("/carts", async (req, res) => {
    try {

        await cartManager.addCart();

        res.status(200).send({ message: "Carrito creado correctamente" });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

router.post("/carts/:cid/product/:pid", async (req, res) => {
    try{
        let productId = parseInt(req.params.pid);
        let cartId = parseInt(req.params.cid);

        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).send({ error: `El producto con ID ${productId} no existe` });
        }

        await cartManager.addProductToCart(cartId, productId);
        res.status(200).send({ message: "Producto agregado correctamente" });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

export default router;
