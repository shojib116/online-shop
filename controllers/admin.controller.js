const Product = require('../models/product.model');

async function getProducts(req, res, next) {
  let products
  try {
    products = await Product.findAll();
  } catch(error) {
    next(error);
    return;
  }

  res.render('admin/products/all-products', {products: products});

}

function getNewProduct(req, res) {
  res.render('admin/products/new-product');
}

async function createNewProduct(req, res) {
  const product = new Product({
    ...req.body,
    image: req.file.filename
  });

  try {
    await product.save()
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}



module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct
};