const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secretJwtKey } = require('../../config');
const { user } = require('../../config');

// - method for user authorization
router.post('/login', async (req, res) => {
    try {
        let loginFound;
        let userI;
        for (let i = 0; i < user.length; i++) {
            if (user[i].login === req.body.login) {
                loginFound = true;
                userI = i;
            } else {
                loginFound = false;
            }
        }

        if (loginFound) {
            // login
            const isMatch = await bcrypt.compare(req.body.password, user[userI].password);

            if (isMatch) {
                const token = jwt.sign(
                    {
                        type: 'user',
                        userLogin: user[userI].login,
                    },
                    secretJwtKey,
                    {
                        expiresIn: '10h',
                    },
                );
                return res.status(200).json({
                    token,
                    message: 'Authorization is successfully!',
                });
            }
            return res.status(400).json({
                message: 'Incorrect Password !',
            });
        }
        return res.status(400).json({
            message: 'Admin Not Exists',
        });
    } catch (err) {
        throw err;
    }
});

module.exports = router;
