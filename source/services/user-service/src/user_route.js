const express = require('express');
const { UserService } = require('./user_service');
const { UserRepo } = require('./user_repo');
const User = require("./user")

const router = express.Router();
const userRepo = new UserRepo(User);
const userService = new UserService(userRepo);
const path = require('path');

// Signup endpoint
router.post('/signup', async (req, res) => {
    console.log(req.body);
    try {
        const response = await userService.addUser(req);
        console.log("JK",response);
        if (response.status === 200) {  // Assuming 201 means success
            res.redirect("/index");
            
        } else {
            res.status(response.status).send(response.message);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        await userService.login(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// When a GET request is made to the root URL, send back index.html
router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Logout endpoint
router.post('/logout', async (req, res) => {
    try {
        await userService.logout(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/userData', (req, res) => {
    const userId = req.headers.user_id;
    console.log("User ID from headers:", userId);
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    userService.getUserData(req, res);
});

router.get('/access', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'access.html'));
});

router.get("/personalData", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'Personal_page.html'));
});
  

module.exports = router;