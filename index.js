// Add Express
const express = require("express");
const { body, validationResult } = require('express-validator');

// Initialize Express
const app = express();
app.use(express.json());

// Simuler un catalogue de produits
const productCatalogue = {
    'product1': { id: 'product1', name: 'Produit 1', price: 10 },
    'product2': { id: 'product2', name: 'Produit 2', price: 20 },
    'product3': { id: 'product3', name: 'Produit 3', price: 30 },
};

// Simuler un panier
let basket = {
    totalPrice: 0,
    products: []
};

// Créer une fonction pour vérifier l'existence du produit
function checkProductExists(productId) {
    return productCatalogue.hasOwnProperty(productId);
}

// Ajouter la logique pour mettre à jour le panier
function addToBasket(productId, quantity) {
    if (checkProductExists(productId)) {
        const product = productCatalogue[productId];
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

// Initialize server
app.listen(3000, () => {
    console.log("Running on port 3000.");
});

module.exports = app;
