const userService = require('../services/users.service.js')

const { findUsers, findUser, createUser } = userService

const getUsers = async(req, res) => {
  try {
    const users = await findUsers
    res.status(200).send(users)
  } catch (err) { 
    res.status(500).send({
      error: 'Users could not be found',
      value: err
    })
  } 
}

const getUser = async(req, res) => {
  try {
    const userid = req.query.id
    const user = await findUser(userid)
    res.status(200).send(user)
  } catch (err) { 
    res.status(500).send({
      error: 'User could not be found',
      value: err
    })
  }
}

const postUser = async(req, res) => {
  try {
    const userprops = req.body
    const user = await createUser(userprops)
    res.status(200).send(user)
  } catch(err) {
    res.status(500).send({
      error: 'User could not be created',
      value: err
    })
  }
}

module.exports = {
  getUsers,
  getUser,
  postUser
}
