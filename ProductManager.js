const fs = require("fs/promises");

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(product) {
    const products = await this.getProducts();
    product.id = this.generateUniqueId(products);
    products.push(product);
    await this.saveProducts(products);
    return product;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data) || [];
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find(
      (product) => product.id.toString() === id.toString()
    );
    return product;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);

    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      await this.saveProducts(products);
      return products[index];
    }

    return null;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const updatedProducts = products.filter((product) => product.id !== id);
    await this.saveProducts(updatedProducts);
    return products.find((product) => product.id === id) || null;
  }

  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  generateUniqueId(products) {
    const maxId = products.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );
    return maxId + 1;
  }
}

module.exports = ProductManager;
