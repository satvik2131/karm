const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const app = express()


const auth = async (req,res,next)=>{
    const token = await app.get('Authorization')
    const decoded =  jwt.verify(token, 'superisupar')
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
}
// const auth = async (req, res, next) => {
//     try {
//         const token = app.get('Authorization')
//         const decoded = jwt.verify(token, 'superisupar')
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

//         if (!user) {
//             throw new Error()
//         }

//         req.token = token
//         req.user = user

//         next()
//     } catch (e) {
//         res.status(401).send({ error: 'Please authenticate.' })
//     }
// }

module.exports = auth