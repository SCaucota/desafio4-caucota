import {promises as fs} from "fs";
import ProductManager from "./productManager.js";

class cartManager {
    static idCart = 0;
    constructor() {
        this.path = "./src/models/carts.json";
        this.carts = [];
        this.productManager = new ProductManager();
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const allCarts = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(allCarts);

            if (this.carts.length > 0) {
                const maxId = Math.max(...this.carts.map(cart => cart.id));
                cartManager.idCart = maxId;
            }
        } catch (error) {
            console.log("Error al cargar los carritos:", error);
            await this.addCart();
        }
    }

    async addCart() {
        try {
            cartManager.idCart++;
            const newCart = { id: cartManager.idCart, products: [] };
            this.carts.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return cartManager.idCart;
        } catch (error) {
            console.log("Error al agregar el nuevo carrito:", error);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const product = await this.productManager.getProductById(productId);

            if (!product) {
                console.error(`El producto con ID "${productId}" no existe.`);
                return;
            }

            const cartIndex = this.carts.findIndex(cart => cart.id === cartId);

            if (cartIndex === -1) {
                console.error(`El carrito con ID "${cartId}" no existe.`);
                return;
            }

            const cart = this.carts[cartIndex];

            const existingProductIndex = cart.products.findIndex(prod => prod.id === productId);

            if (existingProductIndex !== -1) {
                
                cart.products[existingProductIndex].quantity++;
            } else {
                cart.products.push({
                    id: productId,
                    quantity: 1
                });
            }

            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            console.log(`Producto con ID "${productId}" agregado al carrito con ID ${cartId}`);
        } catch (error) {
            console.log("Error al agregar el producto al carrito", error);
        }
    }

    async getCartProducts(cartId) {
        try {
            const cart = this.carts.find(cart => cart.id === cartId);

            if (!cart) {
                console.error(`El carrito con ID "${cartId}" no existe.`);
                return;
            }

            return cart.products;
        } catch (error) {
            console.error("Error al obtener los productos del carrito:", error);
        }
    }
}

export default cartManager;