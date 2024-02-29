// Add Express
const express = require("express");
const { body, validationResult } = require('express-validator');

// Initialize Express
const app = express();
app.use(express.json());

// Catalogue de produits

//    { 'product1': { id: 'product1', name: 'Produit 1', price: 10 },
//     'product2': { id: 'product2', name: 'Produit 2', price: 20 },
//     'product3': { id: 'product3', name: 'Produit 3', price: 30 },
// };

// Panier
let basket = {
    totalPrice: 0,
    products: []
};

// Fonction pour vérifier l'existence du produit
async function checkProductExists(productId) {
    const productCatalogue = await fetch("http://microservices.tp.rjqu8633.odns.fr/api/products");
    const productJSON = await productCatalogue.json();
    return productJSON.find(x => x.productId === productId);
}


async function addToBasket(productId, quantity) {
    if (checkProductExists(productId)) {
        const productCatalogue = await fetch("http://microservices.tp.rjqu8633.odns.fr/api/products");
        const productJSON = await productCatalogue.json();
        const product = productJSON[productId];
        const productTotalPrice = product.price * quantity;
        basket.totalPrice += productTotalPrice;
        basket.products.push({ ...product, quantity });
        console.log(`Produit ajouté au panier : ${productId}, quantité : ${quantity}`);
        return true;
    }
    return false;
}

// Create GET request
app.get("/api/ping", (req, res) => {
    res.send("PONG");
});

app.put('/api/basket', [
    body('id').isString().notEmpty(),
    body('quantity').isInt({ min: 1 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id, quantity } = req.body;
    if (addToBasket(id, quantity)) {
        res.status(204).send();
    } else {
        res.status(400).send({ message: "Le produit n'existe pas." });
    }
});

app.get('/api/basket', (req, res) => {
    res.json(basket);
});

app.get('/api/products/:productId', async (req, res) => {
    const { productId } = req.params;

    if (checkProductExists(productId)) {
        const productCatalogue = await fetch("http://microservices.tp.rjqu8633.odns.fr/api/products");
        const productJSON = await productCatalogue.json();
        const product = productJSON[productId];
        const productDto = {
            _id: product.id,
            ean: "Inconnu",
            name: product.name,
            price: product.price
        };
        res.json(productDto);
    } else {
        res.status(404).send({ message: "Produit non trouvé." });
    }
});

// Initialize server
app.listen(3000, () => {
    console.log("Running on port 3000.");
});

module.exports = app;
