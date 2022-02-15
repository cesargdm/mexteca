/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')

const { TMDB_KEY } = process.env

const API_BASE = 'https://api.themoviedb.org/3'

async function fetchMovieDetails(movie, client) {
  // Get more info from tmdb
  const url = `${API_BASE}/search/movie?api_key=${TMDB_KEY}&query=${movie.title.replace(
    / /g,
    '%20',
  )}&year=${movie.year}&language=es-MX&include_adult=true`

  const tmdbData = await axios(url)
    .then((response) => response.data?.results?.[0])
    .catch((error) => {
      // eslint-disable-next-line no-console
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
          // eslint-disable-next-line no-console
          console.log('Could not find director', error)
          // throw new Error('Could not find director')
          return null
        }

        return data?.id
      })

    if (!movie.director) {
      // eslint-disable-next-line no-console
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

module.exports = { fetchMovieDetails }
