import express from "express";
import { Router } from "express";
import ProductManager from "../controllers/productManager.js";
const router = Router();
const productManager = new ProductManager;


router.get("/", async (req, res) => {
    try{
        const products = await productManager.getProducts();
        res.render("home", {products: products})
    }catch (error){
        res.status(500).json({error: "Error interno del servidor"});
    }
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

export default router;