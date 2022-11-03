
import supertest from "supertest";
import app from "../src/app.js"

const prefix = process.env.PREFIX ?? '/v1/api'
const todo = {
    description: 'This is a description',
}
let token

jest.useRealTimers();

const getToken = async () => {
    const username = 'testUser001'
    const password = '@testUser001'

    const tokenBody = {
        username: username,
        password: password
    }

    const loginResponse = await supertest(app)
        .post(`${prefix}/auth`)
        .send(tokenBody)

    return loginResponse.body.access_token
}

describe('TODO Tasks: ', () => {
    let todoId

    beforeAll(async () => {
        token = await getToken()
    })

    afterAll(async () => {
      console.log('Done testing....')
    })

    it('Should create a Todo', async () => {
        const response = await supertest(app)
            .post(`${prefix}/todos`)
            .send(todo)
            .set('authorization', `${token}`)

        todoId = response.body.data.id
        expect(response.statusCode).toEqual(200)
        expect(response.body.data).toHaveProperty('message')
        expect(response.body).toHaveProperty('data')
    },10000)


    it('Should get TODO', async () => {
        const response = await supertest(app)
            .get(`${prefix}/todos/${todoId}`)
            .set('authorization', `${token}`)

        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('description')
        expect(response.body.data).toHaveProperty('createdAt')
        expect(response.body.data).toHaveProperty('isCompleted')
    },10000)

    it('Should get TODOs', async () => {
        const res = await supertest(app)
            .get(`${prefix}/todos`)
            .set('authorization', `${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body).toHaveProperty('page')
        expect(res.body).toHaveProperty('totalCount')
    },10000)

    it('Should update TODO', async () => {
        const res = await supertest(app)
            .put(`${prefix}/todos`)
            .send({
                description: 'Updated description',
                id: todoId
            })
            .set('authorization', `${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.data).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
    })

    it('Should complete TODO', async () => {
        const response = await supertest(app)
            .put(`${prefix}/todos/${todoId}`)
            .send({
                isCompleted: 1
            })
            .set('authorization', `${token}`)

        expect(response.statusCode).toEqual(200)
        expect(response.body.data).toHaveProperty('message')
        expect(response.body).toHaveProperty('data')
    },10000)

    
    it('Should delete TODO', async () => {

        const res = await supertest(app)
            .delete(`${prefix}/todos`)
            .send({
                id: todoId
            })
            .set('authorization', `${token}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.data).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
    },10000)
})