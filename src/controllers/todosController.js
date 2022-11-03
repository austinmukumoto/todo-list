
import _ from "underscore"
import { model } from "../libs/db"
import { Op } from "sequelize"
import { statusCode } from "../constant/statusCode"
import { format } from "date-fns"
import exception from "../libs/exception"
import Validator from "validatorjs"

exports.create = async (request, response, next) => {

    const bodyDetails = request.body

    const validation = new Validator(bodyDetails, {
        description: ["required", "string", "max:50"]
    })


    if (validation.fails()) {
        let errors = validation.errors.all()
        return response.status(statusCode.UNPROCESSABLE_ENTITY).send({
            errors: errors,
        });
    }

    try {
        const todosCreation = await model('Todos').create({
            description: bodyDetails.description,
            userId: request.users.id
        });

        if (todosCreation) {
            return response.status(statusCode.OK).send({
                data: {
                    id: todosCreation.id,
                    message: "successfully creation of todos for " + request.users.name
                }
            });
        }
    } catch (e) {
        return response.status(statusCode.INTERNAL_SERVER).send(exception("Can't process your request now. Please try again later", 1));
    }
}

exports.update = async (request, response, next) => {
    const bodyDetails = request.body

    const validation = new Validator(bodyDetails, {
        description: ["string", "max:50"],
        id: ["required", "numeric"]
    })

    if (validation.fails()) {
        let errors = validation.errors.all()
        return response.status(statusCode.UNPROCESSABLE_ENTITY).send({
            errors: errors,
        });
    }

    try {
        const todoDetails = await model('Todos').findOne({
            where: {
                id: bodyDetails.id,
                userId: request.users.id
            }
        });

        if (!todoDetails) {
            return response.status(statusCode.BAD_REQUEST).send(exception("No existing todo record for this user", 1));
        }

        todoDetails.description = bodyDetails.description


        await todoDetails.save()


        return response.status(statusCode.OK).send({
            data: {
                message: "successfully update todos for " + request.users.name
            }
        });

    } catch (e) {
        return response.status(statusCode.INTERNAL_SERVER).send(exception("Can't process your request now. Please try again later", 1));
    }
}

exports.complete = async (request, response, next) => {
    const bodyDetails = request.body

    const validation = new Validator(bodyDetails, {
        isCompleted: ["required", "numeric"],
    })

    if (validation.fails()) {
        let errors = validation.errors.all()
        return response.status(statusCode.UNPROCESSABLE_ENTITY).send({
            errors: errors,
        });
    }

    try {
        const todoDetails = await model('Todos').findOne({
            where: {
                id: request.params.id,
                userId: request.users.id
            }
        });

        if (!todoDetails) {
            return response.status(statusCode.BAD_REQUEST).send(exception("No existing todo record for this user", 1));
        }

        todoDetails.isCompleted = 1
        todoDetails.isCompletedAt = new Date()

        await todoDetails.save()

        return response.status(statusCode.OK).send({
            data: {
                message: "successfully completed todos for " + request.users.name
            }
        });

    } catch (e) {
        return response.status(statusCode.INTERNAL_SERVER).send(exception("Can't process your request now. Please try again later", 1));
    }
}

exports.show = async (request, response, next) => {
    const bodyDetails = request.params

    const validation = new Validator(bodyDetails, {
        id: ["required", "numeric"]
    })

    if (validation.fails()) {
        let errors = validation.errors.all()
        return response.status(statusCode.UNPROCESSABLE_ENTITY).send({
            errors: errors,
        });
    }

    try {
        const todoDetails = await model('Todos').findOne({
            where: {
                id: bodyDetails.id,
                userId: request.users.id
            }
        });

        if (!todoDetails) {
            return response.status(statusCode.BAD_REQUEST).send(exception("No existing todo record for this user", 1));
        }

        return response.status(statusCode.OK).send({
            data: {
                description: todoDetails.description,
                createdAt: todoDetails.createdAt,
                isCompleted: todoDetails.isCompleted
            }
        });

    } catch (e) {
        return response.status(statusCode.INTERNAL_SERVER).send(exception("Can't process your request now. Please try again later", 1));
    }
}

exports.getAll = async (request, response, next) => {
    try {

        const requestParams = request.query
        const search = requestParams.search ?? ''
        let page, limit

        const validation = new Validator(requestParams, {
            page: ["numeric"],
            limit: ["numeric"],
        })

        if (validation.fails()) {
            let errors = validation.errors.all()
            return response.status(statusCode.UNPROCESSABLE_ENTITY).send({
                errors: errors,
            });
        }

        page = requestParams.page ? Number(requestParams.page) : (process.env.DEFAULT_PAGE || 1)
        limit = requestParams.limit ? Number(requestParams.limit) : (process.env.DEFAULT_LIMIT || 20)

        const todosCount = await model('Todos').count({
            where: {
                userId: request.users.id,
                description: {
                    [Op.like]: `%${search}%`
                }
            }
        })

        if (todosCount === 0) return response.status(statusCode.OK).send({
            data: [],
            page: 0,
            totalCount: 0
        });

        const offset = limit * (page - 1);

        let todos
        if (!search) {
            todos = await model('Todos').findAll({
                attributes: {
                    exclude: ['updatedAt']
                },
                where: {
                    userId: request.users.id,
                },
                offset,
                limit
            })
        } else {
            todos = await model('Todos').findAll({
                attributes: {
                    exclude: ['updatedAt']
                },
                where: {
                    userId: request.users.id,
                    description: {
                        [Op.like]: `%${search}%`
                    },
                },
                offset,
                limit
            })
        }

        const data = todos.map((todos) => {
            return {
                id: todos.id,
                userId: todos.userId,
                description: todos.description,
                completedAt: todos.isCompletedAt ? format(new Date(todos.isCompletedAt), 'yyyy-MM-dd HH:mm:ss') : null,
                createdAt: format(new Date(todos.createdAt), 'yyyy-MM-dd HH:mm:ss')
            }
        })

        return response.status(statusCode.OK).send({
            data: data,
            page: page,
            totalCount: todos.length
        });

    } catch (e) {
        console.log(e)
        return response.status(statusCode.INTERNAL_SERVER).send(exception("Can't process your request now. Please try again later", 1));
    }
}

exports.remove = async (request, response, next) => {
    const bodyDetails = request.body

    const validation = new Validator(bodyDetails, {
        id: ["required", "numeric"]
    })

    if (validation.fails()) {
        let errors = validation.errors.all()
        return response.status(statusCode.UNPROCESSABLE_ENTITY).send({
            errors: errors,
        });
    }

    try {

        const todoDetails = await model('Todos').findOne({
            where: {
                id: bodyDetails.id,
                userId: request.users.id
            }
        });

        if (!todoDetails) {
            return response.status(statusCode.BAD_REQUEST).send(exception("No existing todo record for this user", 1));
        }

        await model('Todos').destroy({
            where: {
                id: bodyDetails.id,
                userId: request.users.id
            }
        })

        return response.status(statusCode.OK).send({
            data: {
                message: "successfully delete todos for " + request.users.name
            }
        });

    } catch (e) {
        return response.status(statusCode.INTERNAL_SERVER).send(exception("Can't process your request now. Please try again later", 1));
    }
}

