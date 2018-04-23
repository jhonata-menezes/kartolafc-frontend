import axios from 'axios'
import {apiUrl} from './config'

export const http = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  headers: {
      //
  }
})
