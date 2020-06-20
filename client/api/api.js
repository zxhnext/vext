import baseUrl from './urls.js'
import instance from './instance.js'

export default {
    login: params => instance.post(`${baseUrl.host}/users/login`, params),
    create: params => instance.post(`${baseUrl.host}/users`, params),
    createQuestions: params => instance.post(`${baseUrl.host}/questions`, params),
    getQuestionLists: params => instance.get(`${baseUrl.host}/questions`, {params})
}