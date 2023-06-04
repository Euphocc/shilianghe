import axios from "axios"

const service = axios.create({
  baseURL:import.meta.env.VITE_APP_BASE_API,
  // baseURL:"/apis/"
})

export default service
