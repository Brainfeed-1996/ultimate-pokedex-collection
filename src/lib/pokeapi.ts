import axios from 'axios'

export const pokeapi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 15_000,
})
