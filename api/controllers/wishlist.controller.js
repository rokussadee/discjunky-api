const wishlistService = require('../services/wishlist.service.js')

const { addItemToWishlist, removeItemFromWishlist, findWishlist } = wishlistService;

const postItem = async (req,res) => {
  try {
    const { user_id, item_link } = req.body
    const updatedUser = await addItemToWishlist(user_id, item_link)
    res.status(200).send(updatedUser)
  } catch (err) { 
    res.status(500).send({
      error: 'Item could not be added to users wishlist.',
      value: err
    })
  }
}

const deleteItem = async(req, res) => {
  try {
    const { user_id, item_link } = req.body
    const updatedUser = await removeItemFromWishlist(user_id, item_link)
    res.status(200).send(updatedUser)
  } catch (err) {
    res.status(500).send({
      error: 'Item could not be removed from users wishlist.',
      value: err
    })
  }
}

const getWishlist = async(req,res) => {
  try {
    const user_id = req.query.id
    console.log(user_id)
    const wishlist = await findWishlist(user_id)
    res.status(200).send(wishlist)
  } catch(err) {
    res.status(500).send({
      error: 'Wishlist could not be found',
      value: err
    })
  }
}

module.exports = {
  postItem,
  deleteItem,
  getWishlist
}
