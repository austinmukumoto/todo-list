import CryptoJS from 'crypto-js'

exports.hash = (data) => {
    if (typeof data == 'object') {
        data = JSON.stringify(data)
    }
    
    try {
        return CryptoJS.SHA512(data).toString()
    } catch (error) {
        return data
    }
}

exports.encrypt = (data) => {
    if (typeof data == 'object') {
        data = JSON.stringify(data)
    }

    return CryptoJS.AES.encrypt(data.toString(), process.env.APP_KEY || '123').toString()
}

exports.decrypt = (ciphertext) => {
    let bytes = CryptoJS.AES.decrypt(ciphertext, process.env.APP_KEY || '123')
    let text = bytes.toString(CryptoJS.enc.Utf8)

    try {
        return JSON.parse(text)
    } catch (error) {
        return text
    }
}