const authenticationService = require('../services/authentication.service.js')

const { authorizeUser, spotifyAuthFlow } = authenticationService

const loginUser = async(req, res) => {
  try {
    const redirectUrl = await authorizeUser()
    res.status(200).redirect(redirectUrl)
  } catch(err) {
    res.status(500).send({
      error: 'Could not authorize user.',
      value: err
    })
  }
}

const spotifyUserCreation = async(req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if(error){
    console.log('Error:', error)
    res.send(`Callback error: ${error}`)
    return;
  }
  
  try {
    const redirectUrl = await spotifyAuthFlow(code)
    
    res.status(200).redirect(redirectUrl)
  } catch (err) {
    res.status(500).send({
      error: 'Could not complete user creation / login.',
      value: err
    })
  } 
}

module.exports = {
  loginUser,
  spotifyUserCreation
}
