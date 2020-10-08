const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const app = express()


const auth = async (req, res, next) => {
    try {
        if(!req.session.token){
            throw new Error('Invalid token');
        }
        const token = req.session.token;
        const decoded = jwt.verify(token, 'superisupar')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user

        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth