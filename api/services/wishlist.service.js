//const db = require('../db/connect.js')
const { insertUser, pushToWishlist, pullFromWishlist, findUserWishlist} = require('../db/functions.js')

const addItemToWishlist = async(user_id, item_link) => {
    try {
      await pushToWishlist(user_id, item_link)
    } catch (err) { 
      console.log(err) 
    } 
}

const removeItemFromWishlist = async(user_id, item_link) => {
    try {
      await pullFromWishlist(user_id, item_link)
    } catch (err) { 
      console.log(err)
    }
}

const findWishlist = async(user_id)=> {
  try {
    const userWishlist = await findUserWishlist(user_id)
    return userWishlist
  } catch (err) { 
    console.log(err)
  }
}

module.exports ={
  addItemToWishlist,
  removeItemFromWishlist,
 findWishlist
}
