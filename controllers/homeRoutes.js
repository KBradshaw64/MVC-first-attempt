const router = require('express').Router();
const { BlogPost, User } = require('../models');

//landing page
router.get('/', (req, res) => {
    res.render('home')
});

//login page - redirects home if logged in
router.get('/login', (req, res) => {
    if (req.session.logged_in){
        res.redirect('/');
        return;
    }
    res.render('login');
});

//signup page redirects home if already logged in
router.get('/signup', async (req, res) => {
    if (req.session.logged_in){
        res.redirect('/');
        return;
    }
    res.render('signup')
});

module.exports = router