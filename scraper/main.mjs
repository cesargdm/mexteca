/* eslint-disable @typescript-eslint/no-var-requires */
import { createClient } from '@supabase/supabase-js'
import axiosRetry, { exponentialDelay } from 'axios-retry'
import axios from 'axios'
import chalk from 'chalk'

import { scrapWebsiteData } from './scrap.mjs'
import { fetchMovieDetails } from './movies.mjs'
import { sendNotifications } from './notifications.mjs'

const { SUPABASE_KEY } = process.env
const PROJECT_URL = 'https://yzhbekhonsuhaptmxckk.supabase.co'

axiosRetry(axios, { retries: 5, retryDelay: exponentialDelay })

/**
 * Save presentations data to Supabase while fetching and saving
 * any extra information
 * @param {*} param0
 * @returns
 */
async function savePresentations({ client, presentations }) {
  const presentationSaves = presentations.map((presentation) => {
    return async () => {
      process.stdout.write(
        chalk.gray(
          `Getting movie ${presentation.movie.title}, ${presentation.movie.year}`,
        ),
      )
      const {
        data: [existingMovie],
        error: existingMovieError,
      } = await client
        .from('movies')
        .select(
          `
        id, title, year
        `,
        )
        .eq('title', presentation.movie.title)
        .eq('year', presentation.movie.year)
        .limit(1)

      // eslint-disable-next-line no-console
      if (existingMovieError) console.log(existingMovieError)

      const { data: existingPresentation, error: existingPresentationError } =
        existingMovie
          ? await client
              .from('presentations')
              .select('id')
              .eq('location', presentation.location)
              .eq('date', presentation.date)
              .eq('movie', existingMovie?.id)
              .limit(1)
              .then(({ data, error }) => ({ data: data?.[0]?.id, error }))
          : {}

      // eslint-disable-next-line no-console
      if (existingPresentationError) console.log(existingPresentationError)

      if (existingPresentation) {
        process.stdout.write(chalk.gray(`⏭ \n`))
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
          .limit(1)
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

      process.stdout.write(chalk.gray(`📝 `))

      const result = await client.from('presentations').insert({
        location: presentation.location,
        date: presentation.date,
        movie: presentation.movie,
        room: presentation.room,
      })

      return result
    }
  })

  const results = []
  for (const savePresentation of presentationSaves) {
    const result = await savePresentation()
    results.push(result)
  }

  return results
}

/**
 * Runs main program, fetching and saving presentations, movies and directors
 */
async function main() {
  try {
    const client = createClient(PROJECT_URL, SUPABASE_KEY)

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

    if (inserted > 0) {
      // Send Expo Push Notifications to all users
      sendNotifications({ client, insertedCount: inserted })
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

main()
