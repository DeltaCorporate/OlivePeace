import crypto from "crypto";

export function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function generateToken(size = 20){
    return crypto.randomBytes(20).toString('hex');
}

export function isEmpty(value){
    if(typeof value === 'string')
        return value.length === 0;
    return value == null || value == 'undefined';
}

export function isChanged(sequelizeModel,key){
    return sequelizeModel[key] != sequelizeModel.previous(key);
}