const express = require("express");
const { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());

let basket = {
    totalPrice: 0,
    products: []
};

async function checkProductExists(productId) {
    try {
        const responses = await fetch(`http://microservices.tp.rjqu8633.odns.fr/api/products/${productId}`);
        return responses.body;
    }
    catch (e) {
        return null;
    }
}

async function addToBasket(productId, quantity) {
    const product = await checkProductExists(productId);
    if (product) {
        const productTotalPrice = product.price * quantity;
        basket.totalPrice += productTotalPrice;
        basket.products.push({ ...product, quantity, id: productId });
        console.log(`Produit ajouté au panier : ${productId}, quantité : ${quantity}`);
        return true;
    }
    return false;
}

app.get("/api/ping", (req, res) => {
    res.send("PONG");
});

app.put('/api/basket', [
    body('id').isString().notEmpty(),
    body('quantity').isInt({ min: 1 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id, quantity } = req.body;
    if (await addToBasket(id, quantity)) {
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
    const product = await checkProductExists(productId);

    if (product) {
        const productDto = {
            _id: product._id,
            ean: product.ean || "Inconnu",
            name: product.name,
            description: product.description,
            categories: product.categories,
            price: product.price
        };
        res.json(productDto);
    } else {
        res.status(404).send({ message: "Produit non trouvé." });
    }
});

app.post('/api/basket/checkout', async (req, res) => {
    if (basket.products.length === 0) {
        return res.status(400).send({ message: "Impossible de faire un checkout avec un panier vide." });
    }

    try {
        const orderResponse = await fetch('https://api-microservice.vercel.app/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(basket.products)
        });

        if (!orderResponse.ok) {
            return res.status(400).send({ message: `Erreur lors de la création de la commande : ${orderResponse.statusText}` });
        }

        const orderCreated = await orderResponse.json();
        basket = { totalPrice: 0, products: [] };
        res.status(200).json(orderCreated);
    } catch (error) {
        res.status(500).send({ message: "Erreur interne du serveur." });
    }
});


app.listen(3000, () => {
    console.log("Running on port 3000.");
});

module.exports = app;
