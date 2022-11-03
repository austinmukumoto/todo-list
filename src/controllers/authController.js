
import _ from "underscore";
import { model } from "../libs/db";
import { statusCode } from "../constant/statusCode"
import { format } from "date-fns"
import { decrypt } from "../libs/crypto"
import exception from "../libs/exception"
import jwt from "jsonwebtoken"
import Validator from "validatorjs"


exports.create = async (request, response, next) => {

    const bodyDetails = request.body

    const validation = new Validator(bodyDetails, {
        username: ["required", "string", "max:20"],
        password: ["required", "string", "max:50"]
    })

    if (validation.fails()) {
        let errors = validation.errors.all()
        return response.status(statusCode.UNPROCESSABLE_ENTITY).send({
            errors: errors,
        });
    }

    try {
        // CHECK USER DETAILS
        const Users = await model("Users").findOne({
            where: {
                username: bodyDetails.username,
                isActive: 1
            }
        });
        if (!Users) {
            return response.status(statusCode.UNAUTHORIZED).send(exception("Unauthorized user", 1, 401));
        }

        if (bodyDetails.password !== decrypt(Users.password)) {
            return response.status(statusCode.UNAUTHORIZED).send(exception("Unauthorized user", 1, 401));
        }

        const token = jwt.sign(
            { username: Users.username, key: Users.Uid },
            process.env.APP_KEY || '123',
            { expiresIn: "3600s" }
        );

        const expiresAt = new Date(); expiresAt.setMinutes(expiresAt.getMinutes() + process.env.TOKEN_TTL_MINUTES || 60)

        console.log(new Date() + 60);

        const InsertToken = await model("Token").create({
            userId: Users.id,
            token: token,
            isActive: 1,
            expiresAt: format(expiresAt, 'yyyy-MM-dd HH:mm:ss')
        });

        return response.status(statusCode.OK).send({

            access_token: InsertToken.token,
            expires_in: process.env.TOKEN_TTL_SECONDS || 3600,
            token_type: "Bearer"

        });


    } catch (error) {

        console.log("Errors: ", error)
        return response.status(statusCode.INTERNAL_SERVER).send(exception("", 3));
    }
}


