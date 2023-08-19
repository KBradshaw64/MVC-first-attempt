const router = require('express').Router();
const { User, BlogPost } = require('../../models/');
const withAuth = require('../../utils/auth');

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

//brings user to page to create a new blog post
router.get('/post', withAuth, (req, res) => {
    res.render('createPost')
});

module.exports = router;