
import supertest from "supertest";
import app from "../src/app.js"

const prefix = process.env.PREFIX ?? '/v1/api'

jest.useRealTimers();


describe('User can create profile and token', () => {

    const username = 'testUser001'
    const password = '@testUser001'

    const user = {
        username: username,
        password: password,
        name: 'test user'
    }

    afterAll(async () => {
        console.log('Done testing....')
    })

    it('Should create a user', async () => {
        const response = await supertest(app)
            .post(`${prefix}/users`)
            .send(user)

        expect(response.statusCode).toEqual(200)
        expect(response.body.data).toHaveProperty('key')
        expect(response.body.data).toHaveProperty('createdAt')
        expect(response.body).toHaveProperty('data')
    },10000)



    it('Should create a token', async () => {

        const tokenBody = {
            username: username,
            password: password
        }
        const response = await supertest(app)
            .post(`${prefix}/auth`)
            .send(tokenBody)

        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('access_token')
    },10000)
})