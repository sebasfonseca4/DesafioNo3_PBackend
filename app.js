const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

const productManager = new ProductManager('productos.json'); 

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error de Servidor' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error de Servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});
