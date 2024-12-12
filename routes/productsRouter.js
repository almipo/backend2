// routes/products.routes.js
const express = require('express');
const passport = require('passport');
const authorization = require('../middlewares/authorization'); 
const { createProduct, updateProduct, deleteProduct, getProducts } = require('../controllers/products.controller');

const router = express.Router();

// Rutas para productos
router.get('/', getProducts);

// Rutas protegidas para administradores
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  authorization('admin'), 
  createProduct
);

router.put('/:id', 
  passport.authenticate('jwt', { session: false }), 
  authorization('admin'), 
  updateProduct
);

router.delete('/:id', 
  passport.authenticate('jwt', { session: false }), 
  authorization('admin'), 
  deleteProduct
);

module.exports = router;
