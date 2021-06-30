import { Router } from 'express'
import axios from 'axios'
import cheerio from 'cheerio'

const genre = Router()

/** Genre List */
genre.get('/genre', async (req, res) => {
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
      genre_list,
    })
  } catch (error) {
    console.error('genre_list', error.name, error.message)
    return res.status(400).json({
      error: 'gangguan :(',
    })
  }
})

/**
 * TODO: complete this!
 */
genre.get('/genre/:query', async (req, res) => {
  const query: string = req.params.query

  res.send(query)
})

export default genre