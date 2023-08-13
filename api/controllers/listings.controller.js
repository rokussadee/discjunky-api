const listingService = require('../services/listings.service.js')
const fs = require('fs')

const { scrapeDiscogsListings, scrapeWishlistListings } = listingService

const getDiscogsListings = async(req, res) => {
  try {
    const options = req.body
    const listings = await scrapeDiscogsListings(options)
  //  fs.writeFile('./mockfavorites.json', JSON.stringify(listings), 'utf8', err => {
  //    if(err) {
  //      console.log(err)
  //    }
  //  })
    res.status(200).send(listings)
  } catch (err) { 
    res.status(500).send({
      error: 'Listings could not be scraped.',
      value: err
    })
  }
}

const getDiscogsWishlist = async(req, res) => {
  try {
    console.log(req.body)
    const links = req.body.link_array
    const listings = await scrapeWishlistListings(links)
    console.log('controller ln23',listings)
   // fs.writeFile('./mockwishlist.json', JSON.stringify(listings), 'utf8', err => {
   //   if(err) {
   //     console.log(err)
   //   }
   // })
    res.status(200).send(listings)

  } catch(err) {
    res.status(500).send({
      error: 'Wishlist could not be scraped.',
      value: err
    })
  }
}

module.exports = {
  getDiscogsListings,
  getDiscogsWishlist
}
