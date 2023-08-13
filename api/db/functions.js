
const {connectToDatabase} = require('../db/mongodb.js');

let collection

(async() => {
	try {
    const {db} = await connectToDatabase()
    collection = db.collection("users")
	} catch(err) {
    console.log(err)
	}
})();

async function findAllUsers() {
  try {
    const allUsers = await collection.find().toArray()
    return allUsers
  } catch(err) {
    console.log(err)
  }
}

async function insertUser(user) {
  try {
    const insertedUser = await collection.insertOne(user)
    return insertedUser
  } catch(err) {
    console.log(err)
  }
}

async function findUserById(user_id) {
  try {
    const foundUser = await collection.findOne({id: user_id})
    return foundUser
  } catch(err) {
    console.log(err)
  }
}

async function pushToWishlist(user_id, item_link) {
  try{  
    const updatedUser = await collection.updateOne(
        {id: user_id},
        {$push:{wishlist:item_link}})
    return updatedUser
  } catch(err) {
    console.log(err)
  }
}

async function pullFromWishlist(user_id, item_link) {
  try{
      const updatedUser = await collection.updateOne(
        {id: user_id},
        {$pull:{wishlist:{$eq: item_link}}})
      return updatedUser
  } catch(err) {
    console.log(err)
  }
}

async function findUserWishlist(user_id) {
  try{
    const wishlist = await collection
        .find(
          {id: user_id}
        )
        .project(
          {
            _id: 0,
            wishlist: 1
          }
        )
        .toArray((err, results) => {
          return results[0].wishlist
        })
    console.log('dbfunctions ln 78:', wishlist[0].wishlist)
        return wishlist[0].wishlist
  } catch(err) {
    console.log(err)
  }
}

module.exports = {
  findAllUsers,
  insertUser,
  findUserById,
 pushToWishlist,
  pullFromWishlist,
  findUserWishlist
}
