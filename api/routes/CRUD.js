const express = require('express')
const router = express.Router()

const { getUsers, getUser, postUser } = require('../controllers/users.controller.js')

const { postItem, deleteItem, getWishlist } = require('../controllers/wishlist.controller.js')

router.get('/getUsers', getUsers);

router.post('/getUser', getUser);

router.post('/postUser', postUser);

router.post('/postItem', postItem);

router.delete('/deleteItem', deleteItem);

router.get('/getWishlist', getWishlist);

module.exports = router;
