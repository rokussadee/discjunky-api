//source: https://github.com/thelinmichael/spotify-web-api-node

const { insertUser, findUserById } = require('../db/functions.js')
const querystring = require('querystring')


let SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECTURI
})

const authorizeUser = async () => {
  const scopes = [
    'user-top-read',
    'user-read-recently-played',
    'user-library-read', 
    'user-follow-read'
  ];

    return spotifyApi.createAuthorizeURL(scopes)
}

const spotifyAuthFlow= async (code) => {
  console.log(code)
  return spotifyApi.authorizationCodeGrant(code)
  .then(data => {
    const access_token = data.body['access_token'];
    const refresh_token = data.body['refresh_token'];
    const expires_in = data.body['expires_in'];

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    console.log('access token:', access_token);
    console.log('refresh token:', refresh_token);
    
    console.log(`access token expires in  ${expires_in} s.`)
    spotifyApi.getMe()
    .then(async (data) => {
      console.log(data.body)
  
      const result = await findUserById(data.body.id)
      
      if(!result) {
        const user = {
          name: data.body.display_name,
          id: data.body.id,
          img: data.body.images[1].url,
          wishlist: []
        }

        const createdUser = await insertUser(user)
        console.log('ln61:', createdUser)
      }
    }).catch((err) => {
      console.log('ln65:',err)
      return err
    })

		const query = querystring.stringify(data.body);
    console.log('ln73:',query)
		const redirectUrl = `${process.env.CLIENT_REDIRECTURI}?${query}`;
    console.log('ln75:',redirectUrl)

    setInterval(async() => {
      const data = await spotifyApi.refreshAccessToken();
      console.log(data);
      const access_token = data.body['access_token'];

      console.log('access token has been refreshed.');
      console.log('access token:', access_token);

      spotifyApi.setAccessToken(access_token);

    }, 
      expires_in * 1000 - 120000
    );

    console.log('ln89:',redirectUrl)
    return redirectUrl
  })
  .catch(error => {
    console.log('Error refreshing token:', error);
    return error
  })
}
module.exports = {
  authorizeUser,
  spotifyAuthFlow
}
