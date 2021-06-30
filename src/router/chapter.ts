import { Router, Request, Response, NextFunction } from 'express'
import cheerio from 'cheerio'
import { axiosInstance, __devMode } from '../utils/constants'

const chapter = Router()

chapter.use((req, res, next) => {
  /** 24 Hour Cache */
  res.header('Cache-Control', 'public, max-age=86400')
  next()
})

/** Chapter Detail */
chapter.get('/ch/:query', async (req: Request, res: Response) => {
  if (!req.params.query)
    return res.status(400).json({
      status: false,
      message: 'search something!',
    })

  const query: string = req.params.query

  try {
    const response = await axiosInstance.get(`/ch/${query}/`)
    console.log('chapter', query)

    const $ = cheerio.load(response.data)

    const result: Record<string, string | string[]> = {}

    result.title = $('#Judul > h1').text().trim()
    result.cara_baca = $('.tbl > tbody > tr > td:nth-child(2)').text().trim()

    const chapter_image: string[] = []
    $('#Baca_Komik')
      .find('img')
      .each((_, el) => {
        let img_url: string = String($(el).attr('src'))
        chapter_image.push(img_url)
      })

    result.chapter_image = chapter_image

    return res.json(result)
  } catch (error) {
    console.error('chapter_detail', error.name, error.message)
    return res.status(400).json({
      error: 'gangguan :(',
    })
  }
})

export default chapter
