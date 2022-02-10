const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const { zonedTimeToUtc } = require('date-fns-tz')
const { createClient } = require('@supabase/supabase-js')

const PROJECT_KEY = process.env.SUPABASE_KEY
const TMDB_KEY = process.env.TMDB_KEY

const url = 'http://cineteca.edomex.gob.mx/cartelera'
const PROJECT_URL = 'https://yzhbekhonsuhaptmxckk.supabase.co'

const SPANISH_MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

function getCleanText(string) {
  return string.trim().replace(/\n/g, '').replace(/ {2,}/g, ' ')
}

async function scrapData() {
  // read cache from file

  let cache
  try {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('No cache')
    }
    cache = await new Promise((res, rej) =>
      fs.readFile('./cache.html', 'utf8', (err, data) =>
        err ? rej(err) : res(data),
      ),
    )
  } catch (err) {
    console.log('No cache', err)
  }

  let html = cache
  if (!html) {
    const response = await axios(url)
    // save cache to a file

    html = response.data
  }

  const $ = cheerio.load(html)

  let generalInformation = new Map()
  $('.principales').each(function () {
    const generalNode = $(this)

    const title = getCleanText(generalNode.find('h3 span strong').text())
    const room = generalNode.find('p strong').text().replace(/Sala/g, '')

    generalInformation.set(title, room)
  })

  const presentationNodes = $('.modal-content')

  let presentations = []
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
    const [, hourString, minuteString] = time.match(/([0-9]{1,2}):([0-9]{2})/)
    // parse values
    const year = Number(yearString)
    const country = localizedCountry
    const duration = Number(durationString.replace(' min', ''))
    const localPresentationDate = new Date(
      new Date().getFullYear(),
      monthIndex,
      day,
      Number(hourString),
      Number(minuteString),
    )
    // create date with timezone
    const date = zonedTimeToUtc(
      localPresentationDate,
      'America/Mexico_City',
    ).toISOString()

    const room = generalInformation.get(localizedTitle)

    presentations.push({
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

  return presentations
}

async function fetchMovieDetails(movie, client) {
  // get more info from moviedb
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${movie.title.replace(
    / /g,
    '%20',
  )}&year=${movie.year}&language=es-MX&include_adult=true`

  const tmdbData = await axios(url)
    .then((response) => response.data?.results?.[0])
    .catch((error) => {
      console.log('Error fetching details from TMDB', error)
      throw error
    })

  if (movie.directorName) {
    movie.director = await client
      .from('directors')
      .select(
        `
      id, name
      `,
      )
      .eq('name', movie.directorName)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.log('Could not find director', error)
          // throw new Error('Could not find director')
          return null
        }

        return data?.id
      })

    if (!movie.director) {
      console.log(
        `No director found, creating new record for "${movie.directorName}"`,
      )
      // TODO: search moviedb to find more information about the director

      const { data: director } = await client.from('directors').insert({
        name: movie.directorName,
      })
      movie.director = director.id
    }

    delete movie.directorName
  }

  if (!tmdbData) {
    return movie
  }

  return {
    ...movie,
    title: tmdbData.orginal_title ?? movie.title,
    duration: tmdbData.duration ?? movie.duration,
    tmdbId: tmdbData.id,
    posterUrl: `https://image.tmdb.org/t/p/original/${tmdbData.poster_path}`,
    tmdbRating: tmdbData.vote_average,
    description: tmdbData.overview || movie.description,
  }
}

async function main() {
  try {
    const client = createClient(PROJECT_URL, PROJECT_KEY)

    let presentations = await scrapData()

    // Save data to Supabase
    const res = await Promise.allSettled(
      presentations.map(async (presentation) => {
        const { data: existingMovie } = await client
          .from('movies')
          .select(
            `
          id, title, year
          `,
          )
          .eq('title', presentation.movie.title)
          .eq('year', presentation.movie.year)
          .maybeSingle()

        const existingPresentation = existingMovie
          ? await client
              .from('presentations')
              .select('id')
              .eq('date', presentation.date)
              .eq('movie', existingMovie?.id)
              .maybeSingle()
              .then(({ data }) => data?.id)
          : null

        if (existingPresentation) {
          return Promise.resolve('EXISTING')
        }

        if (!existingMovie?.id) {
          console.log(
            `No movie found, creating new record "${presentation.movie.title}"`,
          )
          const movie = await fetchMovieDetails(presentation.movie, client)

          presentation.movie = await client
            .from('movies')
            .insert(movie)
            .maybeSingle()
            .then(({ data, error }) => {
              if (error) {
                console.log('Could not insert', error)
                throw new Error('Could not insert movie')
              }
              console.log('Inserted new movie', data.title)
              return data.id
            })
        } else {
          presentation.movie = existingMovie.id
        }

        return client.from('presentations').insert({
          date: presentation.date,
          movie: presentation.movie,
          room: presentation.room,
        })
      }),
    )

    const inserted = res.filter(
      ({ status, value }) => status === 'fulfilled' && value !== 'EXISTING',
    )?.length

    console.log(`Inserted ${inserted} new presentations`)
  } catch (err) {
    console.log(err)
  }
}

main()
