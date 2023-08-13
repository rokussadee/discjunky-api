const express = require('express')
const router = express.Router()
const fs = require('fs')

const {getDiscogsListings, getDiscogsWishlist} = require('../controllers/listings.controller.js')

router.post('/getDiscogsListings',getDiscogsListings)
 
router.post('/getDiscogsWishlist', getDiscogsWishlist)

module.exports = router;
