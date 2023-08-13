const express = require('express')
const router = express.Router()
const querystring = require('querystring')
let SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi = new SpotifyWebApi()

router.get('/getUserId', async(req, res) => {
  try {
    spotifyApi.getMe()
    .then(data => {
      const user_id = data.body.id
      res.status(200).send(user_id)
      return user_id
    })
  } catch(error) { console.log('error getting user id:', error)}
})

router.get('/getUser', async (req, res) => {
  const token = req.query.token;
  console.log(token)
  try {
    spotifyApi.setAccessToken(token)

    let topTracks = await getTopTracks()

    const topAlbums = await Promise.all(topTracks.map(async (object) => {
      const albumInfo = await getAlbum(object.album.id)
      return {
        ...albumInfo,
        artists: object.artists
      }
    }))

    res.send(topAlbums)
  } catch(error) {
    console.error('error getting profile: ',error);
  }
});

async function getAlbum(id) {
  const data = await spotifyApi.getAlbum(id)

  let album = {
    title: data.body.name,
    id: data.body.id,
    image: data.body.images[0].url,
    thumbnail: data.body.images[2].url
  }

  return album
}

async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
   // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
  }
  return playlists
}

 async function getTopTracks() {
  const data = await spotifyApi.getMyTopTracks()

  let tracks = [];

  for (let track_obj of data.body.items) {
    let track = {
      title: track_obj.name,
      album: {title: track_obj.album.name, id: track_obj.album.id},
      artists: [...track_obj.artists.map(object => {
        return object.name
      })]
    }
    tracks.push(track);
  }

  return tracks;
}

async function getTopArtists() {
  const data = await spotifyApi.getMyTopArtists()
   console.log(data)
  let artists = [];

  for (let artist_obj of data.body.items) {
    artists.push(artist_obj);
    console.log(artist_obj)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return artists;
}

async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

module.exports = router;
