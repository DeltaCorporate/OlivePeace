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

export function randomDate(startYear, endYear) {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * (new Date(year, month + 1, 0).getDate())) + 1;
    return new Date(year, month, day);
}