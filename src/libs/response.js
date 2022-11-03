export default (data = {}, statusCode = 200, headers = {}) => {
    let body = JSON.stringify(data)

    return {
        statusCode,
        body,
        headers
    }
}