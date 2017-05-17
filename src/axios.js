import axios from 'axios'
import {apiUrl} from './config'

export const http = axios.create({
  baseURL: apiUrl,
  headers: {
      //
  }
})
