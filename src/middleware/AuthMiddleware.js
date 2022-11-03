import exception from '../libs/exception';
import { model } from "../libs/db";
import { statusCode } from "../constant/statusCode"
import jwtDecode from 'jwt-decode';

export default async (request, response, next) => {

    // VALIDATION OF TOKEN
    if (!request.headers.authorization) {
        return response.status(statusCode.UNAUTHORIZED).send(exception('Unauthorized user', 1));
    }

    const auth = jwtDecode(request.headers.authorization)



    // GET VALID USERS
    try {
        let Users = await model('Users').findOne({
            where: {
                username: auth.username,
                Uid: auth.key,
                isActive: 1
            }
        });

        // token expiration
        let token = await model('Token').findOne({
            where: {
                userId: Users.id,
                token: request.headers.authorization
            },
            order: [ [ 'createdAt', 'DESC' ]],
        })

        if(new Date(token.expiresAt) < new Date()) {
            return response.status(statusCode.UNAUTHORIZED).send(exception('Incoming token is already expired', 1));
        }
        

        if (!Users) {
            return response.status(statusCode.BAD_REQUEST).send(exception('Unsupported user', 1));
        }
        request['users'] = Users;

        next();
    } catch (e) {
        console.log(e)
    }
};