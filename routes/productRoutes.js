const express = require('express');
const controller = require('../controllers/productController');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/low-stock', controller.lowStock);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

router.post('/:id/increase', controller.increaseStock);
router.post('/:id/decrease', controller.decreaseStock);

module.exports = router;
