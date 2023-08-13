// source: https://pptr.dev/

const puppeteer = require('puppeteer')
const args = [
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  // '--shm-size=3gb'
]
const browserOptions = {
    headless: true,
    handleSIGINT: false,
    args: args
  }

let browser;

const scrapeDiscogsListings = async (options) => {
  browser = await puppeteer.launch(browserOptions)

  let order
  if(options.sort == 'newestfirst') {
    order = "listed%2Cdesc"
  }
  if (options.sort == 'lowestfirst') {
    order = 'price%2Casc';
  }
  let limit = options.limit
  let format = options.format
  let body = Array.from(options.list)

  const promised = body.map(async function (album) {
    let query = `${[...album.artists]}-${album.title}`
    const encodedQuery = encodeURIComponent(query)
    const discogsData = await scrapeWebPage(order, limit, format, encodedQuery)
      return{
        ...album,
        listings: discogsData
    }
  })
  
  const data = await Promise.all(promised)
  .then(async (promised) => {
    let filteredpromise =  Array.from(promised).filter((item) => item.listings !== undefined);

    return filteredpromise
  })
  .finally(async () => {
    await browser.close()
  })
  return data
}

const scrapeWishlistListings = async (links) => {
  browser = await puppeteer.launch(browserOptions)

  console.log('listingservice ln 55:',links)

  const promised = await links.map(async (listingPage) => {
    const listingData = await openListingPage(listingPage)
    return {
      item_link: listingPage, 
      ...listingData
    }
  })

  const data = await Promise.all(promised)
  .then(async (promised) => {
    return promised
  })
  .finally(async() => {
    await browser.close()
  })
  return data
}

async function scrapeWebPage(order, limit, format, encodedQuery)  {
  try {
    const page = await browser.newPage()
  
    await page.goto(`https://www.discogs.com/sell/list?sort=${order}&limit=${limit}&q=${encodedQuery}`, {
      waitUntil: 'networkidle2'
    });
    let isLoaded = await page.waitForSelector('tr.shortcut_navigable', {timeout: 3000});
    if (isLoaded) {
      let result = await getPageListings(page)
      return result
    }
    await page.close()
  } catch(e) {
    console.log(encodedQuery,e)
  }
}

async function openListingPage(link) {
  try {

    const page = await browser.newPage()

    await page.goto(link, {
      waitUntil: 'networkidle2'
    })

    let isLoaded = await page.waitForSelector('div#page', {timeout: 10000} )
    if (isLoaded) {
      let result = await scrapeListingDetails(page)
      return result
    }
    await page.close()
  } catch(err) {
    console.log(err)
  }
}
/**
 *  
 * @param   {Object} page An object of the page puppeteer is scraping over
 * @returns {Array}       An array of objects containing properties for each queried listing
 */
async function getPageListings(page) {
  try {
    return await page.$$eval('tr.shortcut_navigable:not(.unavailable)', async items => {
      let itemCollection = [];
      [...items].map( async item => {
        const result = {
          discogs_title: await item.querySelector('td.item_description a.item_description_title').innerText,
          price: await item.querySelector('td.item_price > span.price').innerText,
          shipping: await item.querySelector('td.item_price > span.item_shipping').innerText,
          link: await item.querySelector('td.item_description a.item_description_title').href,
          condition: await item.querySelector('td.item_description p.item_condition span.condition-label-mobile + span').innerText,
          discogs_image: await item.querySelector('td.item_picture > a.thumbnail-lazyload > img').getAttribute("data-src"),
          seller_name: await item.querySelector('td.seller_info div.seller_block > strong > a').innerText,
          seller_rating: await item.querySelector('td.seller_info span.star_rating + strong').innerText
        }
        itemCollection.push(result)
      })
      return await itemCollection
    })
  } catch(e) {
    console.log(e)
  }
}

async function scrapeListingDetails(page) {
  try {
    const listingDetails = await page.waitForSelector('div#page')
    .then(async () => {
      const result = {
        album_title: await page.$eval('#profile_title > span:nth-child(2)', el => el.innerText),
        artist_title: await page.$eval('#profile_title > span:last-of-type', el => el.innerText),
        format: await page.$eval('#page_content > div > div.body > div > div.profile > div:nth-child(6)', el => el.innerText),
        price: await page.$eval('#page_aside > div > div.hide_mobile > div > div > p > span.price', el => el.innerText),
        shipping: await page.$eval('#page_aside > div > div.hide_mobile > div > div > p > span.reduced', el => el.innerText),
        condition: await page.$eval('#page_aside > div > div:nth-child(2) > div > p:nth-child(1) > span', el => el.innerText),
        discogs_image: await page.$eval('#page_content > div > div.body > div > div.image_gallery.image_gallery_large > a > span.thumbnail_center > img', el => el.src),
        seller_name: await page.$eval('#page_aside > div > div:nth-child(3) > div.section_title > a', el => el.innerText),
        seller_rating: await page.$eval('#page_aside > div > div:nth-child(3) > div.section_content > strong', el => el.innerText)
      }
      return await result
    })
    return await listingDetails
  } catch(err) {
    console.log(err)
  }
}

module.exports = {
  scrapeDiscogsListings,
  scrapeWishlistListings
}
