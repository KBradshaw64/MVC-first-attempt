const router = require('express').Router();
const { BlogPost, User } = require('../models');
const withAuth = require('../utils/auth');

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

//brings user to page to create a new blog post
router.get('/post', withAuth, (req, res) => {
    res.render('createPost')
});

//main page for all blog posts
router.get('/blogs', withAuth, async (req, res) => {
    try {
        const blogData = await BlogPost.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
        const posts = blogData.map((post) => post.get({ plain: true }));

        res.render('blogs', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err){
        res.status(500).json(err);
    }
});

//page for a single post
router.get('/blogs/:id', withAuth, async (req, res) => {
    try {
        const blogData = await BlogPost.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        });
        const post = blogData.get({ plain: true });

        res.render('singleBlog', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router