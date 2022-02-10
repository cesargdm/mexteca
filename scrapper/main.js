/* eslint-disable @typescript-eslint/no-var-requires */
const { createClient } = require('@supabase/supabase-js')
const axiosRetry = require('axios-retry')
const axios = require('axios')

axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay })

const { scrapWebsiteData } = require('./scrap')
const { fetchMovieDetails } = require('./movies')

const PROJECT_KEY = process.env.SUPABASE_KEY

const PROJECT_URL = 'https://yzhbekhonsuhaptmxckk.supabase.co'

/**
 * Save presentations data to Supabase while fetching and saving
 * any extra information
 * @param {*} param0
 * @returns
 */
function savePresentations({ client, presentations }) {
  return Promise.allSettled(
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
        // Resolve with 'EXISTING' so we know how many new saves we have
        return Promise.resolve('EXISTING')
      }

      if (!existingMovie?.id) {
        // eslint-disable-next-line no-console
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
              // eslint-disable-next-line no-console
              console.log('Could not insert movie', error)
              throw new Error('Could not insert movie')
            }
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
}

/**
 * Runs main program, fetching and saving presentations, movies and directors
 */
async function main() {
  try {
    const client = createClient(PROJECT_URL, PROJECT_KEY)

    // Scrap main website page
    const presentations = await scrapWebsiteData(
      'http://cineteca.edomex.gob.mx/cartelera',
    )

    const results = await savePresentations({ client, presentations })

    const inserted = results.filter(
      ({ status, value }) => status === 'fulfilled' && value !== 'EXISTING',
    )?.length

    // eslint-disable-next-line no-console
    console.log(
      `Scrapped ${results.length} presentations\nInserted ${inserted} new presentations`,
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

main()
