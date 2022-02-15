/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')

const axios = require('axios')
const cheerio = require('cheerio')
const { zonedTimeToUtc } = require('date-fns-tz')

const { getCleanText, SPANISH_MONTHS } = require('./utils')

const { NODE_ENV } = process.env

/**
 * Scraps presentations with movie and director data from a given Cineteca URL
 * it may also return extra urls to fetch more data
 * @param {*} url
 * @returns
 */
async function scrapWebsiteData(url) {
  // eslint-disable-next-line no-console
  console.log(`Scrapping ${url}`)
  // read cache from file

  let cache
  const cacheKey = `./${url.replace(/.*\.mx\//g, '')}-cache.html`
  try {
    // Only use a cache for development purposes
    if (NODE_ENV !== 'production') {
      cache = await new Promise((resolve) => {
        try {
          fs.readFile(cacheKey, 'utf8', (err, data) =>
            err ? resolve() : resolve(data),
          )
        } catch {
          resolve()
        }
      })
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('No cache', err)
  }

  let html = cache
  if (!html) {
    const response = await axios(url)
    if (NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`Saving cache at ${cacheKey}`)
      await new Promise((resolve) =>
        fs.writeFile(cacheKey, response.data, (err) =>
          err ? resolve(err) : resolve(),
        ),
      )
    }

    html = response.data
  } else {
    // eslint-disable-next-line no-console
    console.log(`Found cache! ${cacheKey}`)
  }

  const $ = cheerio.load(html)

  const generalPresentationsInfo = new Map()
  $('.principales').each(function () {
    const generalNode = $(this)

    const title = getCleanText(generalNode.find('h3 span strong').text())
    const room = generalNode.find('p strong').text().replace(/Sala/g, '')

    generalPresentationsInfo.set(title, room)
  })

  const presentationNodes = $('.modal-content')

  const presentations = []
  presentationNodes.each(function () {
    const presentationNode = $(this)

    const localizedTitle = getCleanText(
      presentationNode.find('.modal-header h1 strong').text(),
    )

    const [
      dirtyTitle,
      yearString,
      localizedCountry,
      directorName,
      durationString,
    ] = presentationNode
      .find('.modal-title > span > span')
      .toArray()
      .map((e) => e.children[0].data)
    const classification = presentationNode
      .find('.modal-title > span')
      .filter(function () {
        const el = $(this)
        return typeof el.text() === 'string' && !el.children().length
      })
      .text()

    const title = getCleanText(dirtyTitle)

    const [, unparsedDay, unparsedMonth, time, dirtyDescription] =
      presentationNode
        .find('.modal-body span')
        .filter(function () {
          const el = $(this)
          return typeof el.text() === 'string' && !el.children().length
        })
        .map(function () {
          return $(this).text()
        })
        .toArray()
    const description = getCleanText(dirtyDescription)

    // presentation date
    const monthIndex = SPANISH_MONTHS.findIndex((spanishMonth) =>
      unparsedMonth.includes(spanishMonth),
    )

    const trailerUrl = presentationNode.find('.modal-body iframe').attr('src')

    // retrieve the iso date for the presentation
    const day = parseInt(unparsedDay.trim())
    const [, hourString, minuteString] = time.match(/([0-9]{1,2}):([0-9]{2})/) ?? []

    // parse values
    const year = Number(yearString)
    const country = localizedCountry
    const duration = Number(durationString.replace(' min', ''))
    const hour = Number(hourString)
    const minute = Number(minuteString)

    const localPresentationDate = new Date(
      new Date().getFullYear(),
      monthIndex,
      day,
      hour,
      minute,
    )

    if (!localPresentationDate.getTime()) {
      // eslint-disable-next-line no-console
      console.log(
        `Could not parse date for ${localizedTitle} ${localPresentationDate}`,
      )
      return
    }

    // create date with timezone
    const date = zonedTimeToUtc(
      localPresentationDate,
      'America/Mexico_City',
    ).toISOString()

    const room = generalPresentationsInfo.get(localizedTitle)

    presentations.push({
      // We're passing the movie details in case we need to create a new one
      movie: {
        title,
        year,
        directorName,
        duration,
        country,
        description,
        trailerUrl,
        classification,
      },
      date,
      room,
    })
  })

  // Check if the page includes reference to more listing links
  const extraUrls = []
  $('#Fondo a').each((_, value) => {
    var link = $(value).attr('href')
    extraUrls.push(link)
  })

  let extraPresentations = []
  if (extraUrls) {
    extraPresentations = await Promise.allSettled(
      extraUrls.map((url) => scrapWebsiteData(url)),
    ).then((results) => results.map((result) => result.value))

    extraPresentations = extraPresentations.flat()
  }

  return presentations.concat(extraPresentations)
}

module.exports = { scrapWebsiteData }
