//modulo de token
import jwt from "jsonwebtoken"
//Variable (config) token_secret
import { TOKEN_SECRET } from "../config.js"
import { token } from "morgan"
//funcion creacon del token
export function createAccesToken(payload){
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn: "1d",
            },
            (err, token) => {
                if(err) reject(err)
                resolve(token)
            }
        )
    })
}