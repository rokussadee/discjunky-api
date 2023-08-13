const { insertUser, findUserById, findAllUsers } = require('../db/functions.js')

const findUsers = async () => {
  try {
    const users = await findAllUsers()
    return users
  } catch (err) { 
    console.log(err)
  }
}

const findUser = async (id) => {
  try { 
    await findUserById(id)
  } catch (err) {
    console.log(err)
  } 
}

const createUser = async (userdata) => {
  const user = {
    name: userdata.name,
    id: userdata.id,
    img: userdata.img,
    wishlist: []
  }
  try {
    await insertUser(user)

  } catch (err) {
    console.log(err)
  }
} 

module.exports = {
  findUsers,
  findUser,
  createUser
}
