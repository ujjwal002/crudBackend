const express = require('express');

const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.auth = (req,res)=>{
    try {
        const token = req.cookie.token;
        if(!token){
            return res.status(404).json({
                success: false,
                message: 'No token provided.';
            })
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
   
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Token is not valid.'
            })
            
        }
        next();
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Someting went wrong'
        })
        
    }
}