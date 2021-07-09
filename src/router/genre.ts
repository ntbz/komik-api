import { Router } from 'express'
import axios from 'axios'
import cheerio from 'cheerio'

const genre = Router()

/** add cache 24 hour */
genre.use((req, res, next) => {
  res.header('Cache-Control', 'max-age=86400, must-revalidate')
  next()
})

/** Genre List */
genre.get('/', async (req, res) => {
  try {
    const url: string = 'https://data.komiku.id/cari/?post_type=manga&s='

    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const genre_list: object[] = []
    $('#genr > .genre > li').each((i, el) => {
      let genre_endpoint = $(el).find('a').attr('href')
      let genre_title = $(el).find('a').text().trim()

      genre_list.push({ genre_endpoint, genre_title })
    })

    return res.json({
      status: true,
      path_name: 'genre_list',
      result: genre_list,
    })
  } catch (error) {
    console.error('genre_list', error.name, error.message)
    return res.status(400).json({
      error: 'gangguan :(',
    })
  }
})

export default genre
