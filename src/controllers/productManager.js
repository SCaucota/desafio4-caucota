import {promises as fs} from "fs";

class ProductManager {
    static idProduct = 0;
    constructor() {
        this.path = "./src/models/books.json";
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const allProducts = await fs.readFile(this.path, "utf-8");
            this.products = JSON.parse(allProducts);

            if (this.products.length > 0) {
                const maxId = Math.max(...this.products.map(product => product.id));
                ProductManager.idProduct = maxId;
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.log("Error al cargar los productos:", error);
            }
        }
    }

    addProduct = async (title, description, code, price, img, status, stock, category) => {
        try {
            if (!title ||
                !description ||
                !code ||
                !price ||
                !img ||
                !status ||
                stock === undefined ||
                !category
            ) {
                console.error("Todos los campos del producto son obligatorios");
                return;
            }

            if (this.products.some(prod => prod.code === code)) {
                console.error(`El código (code) del producto ${title} ya está en uso`);
                return;
            }

            ProductManager.idProduct++

            this.products.push({
                id: ProductManager.idProduct,
                title: title,
                description: description,
                code: code,
                price: price,
                img: img,
                status: true,
                stock: stock,
                category: category
            });

            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
        } catch (error) {
            console.log("Error al agregar el producto", error);
        }
    }

    getProducts = async () => {
        try {
            const allProducts = await fs.readFile(this.path, "utf-8");
            const parsedProducts = JSON.parse(allProducts);

            if (parsedProducts.length === 0) {
                console.log("No hay productos disponibles.");
            } else {
                return parsedProducts;
            }
        } catch {
            return this.products;
        }
    }

    getProductById = async (id) => {
        try {
            const allProducts = await fs.readFile(this.path, "utf-8");

            const book = (JSON.parse(allProducts)).find(product => product.id === id);

            if (!book) {
                console.error(`El producto de id "${id}" no existe`);
                return;
            }

            return book;
        } catch (error) {
            console.log("No se pudo enconrar el producto requerido", error);
        }
    }

    updateProduct = async (id, fields) => {
        try {
            const allProducts = await fs.readFile(this.path, "utf-8");
            const products = JSON.parse(allProducts);
    
            const productIndex = products.findIndex(product => product.id === id);
    
            if (productIndex === -1) {
                console.error(`El producto de id "${id}" no existe`);
                return;
            }

            for (const field in fields) {
                if (field !== "id" && fields[field] !== undefined) {
                    products[productIndex][field] = fields[field];
                }
            }
    
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log(`Producto con ID "${id}" actualizado correctamente`);
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    deleteProduct = async (id) => {
        const allProducts = await fs.readFile(this.path, "utf-8");

        const products = JSON.parse(allProducts);

        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            products.splice(productIndex, 1);

            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log(`El producto de id "${id}" ha sido eliminado`);
        } else {
            console.log(`El producto de id "${id}" no existe`);
        }
    }
}

export default ProductManager;