import axios from 'axios'

export const http = axios.create({
  baseURL: `http://192.168.0.20:5015`,
  headers: {
      //
  }
})
