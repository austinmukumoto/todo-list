import { response } from 'express';

let errors = [
    {
        exception: 'unprocessableEntityException',
        message: 'Unprocessable Entity',
        status: 422
    }, {
        exception: 'userErrorException',
        message: 'User Error',
        status: 400
    },  {
        exception: 'InternalServerException',
        message: 'Internal Server Error',
        status: 500
    }

];

export default (details, index = 0, status=0) => {
    let response = errors[index];
    response.details = details;

    if(status != 0)
        response.status = status

    return response;
};