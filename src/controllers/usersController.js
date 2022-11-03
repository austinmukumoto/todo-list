
import _ from "underscore";
import { model } from "../libs/db";
import { statusCode } from "../constant/statusCode"
import { format } from "date-fns"
import { encrypt } from "../libs/crypto"
import exception from "../libs/exception"
import Validator from "validatorjs"


exports.create = async (request, response, next) => {

    const bodyDetails = request.body

    const validation = new Validator(bodyDetails, {
        username: ["required", "string", "max:20"],
        password: ["required", "string", "max:20"],
        name: ["required", "string", "max:50"]
    })

    if (validation.fails()) {
        let errors = validation.errors.all()
        return response.status(statusCode.UNPROCESSABLE_ENTITY).send({
            errors: errors,
        });
    }

    try {
        // CHECK USER DETAILS
        const Users = await model('Users').findOne({
            where: {
                username: bodyDetails.username,
            }
        });
        if (Users) {
            return response.status(statusCode.BAD_REQUEST).send(exception('Invalid user details', 1));
        }

        const UsersCreate = await model('Users').create({
            username: bodyDetails.username,
            name: bodyDetails.name,
            password: encrypt(bodyDetails.password)
        });


        return response.status(statusCode.OK).send({
            data: {
                key: UsersCreate.Uid,
                createdAt: format(UsersCreate.createdAt, 'yyyy-MM-dd HH:mm:ss')
            }
        })

    } catch (error) {

        console.log('Errors: ', error)
        return response.status(statusCode.INTERNAL_SERVER).send(exception('', 3));
    }
}


