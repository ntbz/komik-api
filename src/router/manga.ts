import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios'
import cheerio from 'cheerio'
import { axiosInstance, __devMode } from '../utils/constants'
import { removeQueryParams } from '../utils/helpers'

const manga = Router()

manga.use((req, res, next) => {
  /** 1 Hour Cache */
  res.header('Cache-Control', 'public, max-age=3600')
  next()
})

/** Manga Detail */
manga.get('/manga/:query', async (req: Request, res: Response) => {
  const query: string = req.params.query

  try {
    const response = await axiosInstance.get(`/manga/${query}/`)

    const $ = cheerio.load(response.data)

    const result: Record<string, string | object | boolean> = {}

    if (!!response.data) {
      result.title = $('#Judul > h1').text().trim()
      result.idn_title = $('#Judul > .j2').text().trim()
      result.description = $('#Judul > .desc').text().trim()
      result.thumbnail = removeQueryParams(String($('#Informasi > .ims > img').attr('src')))

      const tabel_informasi = $('#Informasi > .inftable > tbody')
      result.type = $(tabel_informasi)
        .children()
        .eq(1)
        .find('td:nth-child(2) > a > b')
        .text()
        .trim()

        .toLowerCase()
      result.author = $(tabel_informasi).children().eq(3).find('td:nth-child(2)').text().trim()
      result.status = $(tabel_informasi)
        .children()
        .eq(4)
        .find('td:nth-child(2)')
        .text()
        .trim()
        .toLowerCase()

      /** Genre List */
      const genre_list: string[] = []
      $('.perapih')
        .find('.genre > li')
        .each((i, el) => {
          genre_list.push($(el).find('a').text())
        })
      result.genre = genre_list

      /** Chapter */
      const chapter_list: object[] = []
      $('#Daftar_Chapter > tbody')
        .find('tr')
        .each((i, el) => {
          if (i == 0) return
          let chapter_title = $(el).find('a').text().trim()
          let chapter_endpoint = String($(el).find('a').attr('href'))
            .replace('/ch/', '')
            .replace(/\\|\//g, '')

          chapter_list.push({ chapter_title, chapter_endpoint })
        })

      result.chapter = chapter_list
    } else {
      res.statusCode = 404
    }

    return res.json({
      status: res.statusCode == 200,
      result,
    })
  } catch (error) {
    console.error('manga_detail', error.name, error.message)
    return res.status(400).json({
      error: 'gangguan :(',
    })
  }
})

/** Search Helper */
manga.get('/search', (req, res) =>
  res.json({
    status: true,
    message: 'pencarian',
    tutorial: '/search/{query} \n ganti query sama komik yang mau dicari :)',
  }),
)

/** Search */
manga.get('/search/:query', async (req: Request, res: Response) => {
  const query: string = req.params.query
  const url: string = `https://data.komiku.id/cari/?post_type=manga&s=${query}`
  // console.log(query, url)

  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const manga_list: object[] = []
    $('.daftar')
      .find('.bge')
      .each((_, el) => {
        let endpoint = String($(el).find('a').attr('href')).replace('https://komiku.id/manga/', '')
        let thumbnail = String($(el).find('div.bgei > a > img').attr('data-src'))
        let type = $(el).find('div.bgei > a > div.tpe1_inf > b').text().toLowerCase()
        let title = $(el).find('.kan').find('h3').text().trim()
        let updated_on = $(el).find('div.kan > p').text().split('.')[0].trim()
        manga_list.push({
          endpoint,
          thumbnail: removeQueryParams(thumbnail),
          type,
          title,
          updated_on,
        })
      })

    const responseStatus = manga_list.length > 0
    res.statusCode = responseStatus ? 200 : 404

    return res.json({
      status: responseStatus,
      result: manga_list,
    })
  } catch (error) {
    console.error('manga_search', error.name, error.message)
    return res.status(400).json({
      error: 'gangguan :(',
    })
  }
})

export default manga
