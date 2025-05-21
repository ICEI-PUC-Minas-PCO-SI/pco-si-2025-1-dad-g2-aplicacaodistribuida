import axios from 'axios'

const api =axios.create({
    baseURL:'https://testdeployapi-ovvd.onrender.com'
})


export default api