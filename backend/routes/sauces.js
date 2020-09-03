const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');
const auth = require('../middleware/auth');
const sauceControlleur = require('../controlleurs/sauces');

router.get('/', auth, sauceControlleur.getSauces);
router.get('/:id', auth, sauceControlleur.getSauce);
router.post('/', auth, multer, sauceControlleur.createSauce);
router.post('/:id/like', auth, sauceControlleur.like);
router.put('/:id', auth, multer, sauceControlleur.updateSauce);
router.delete('/:id', auth, sauceControlleur.deleteSauce);

module.exports = router;
