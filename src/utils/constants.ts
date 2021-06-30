import axios from 'axios'

export const __devMode: boolean = process.env.NODE_ENV !== 'production'

export const komikEndpoint: string = 'https://komiku.id/'

export const axiosInstance = axios.create({
  baseURL: komikEndpoint,
})
