const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Horse = require('../models/horse');
const Entry = require('../models/entry');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});
router.get('/find', (req, res) => {
    Account
        .find({})
        .exec()
        .then(owners => {
            res.render('find', { user : req.user, owners: owners});
        })
        .catch(err => { console.error(err)});

    
});


router.get('/profile', (req, res) => {
    if(!req.user){
        return res.redirect("/")
    }
    Horse
        .find({owner: req.user._id})
        .exec()
        .then(horses => {
            console.log('dog')
            console.log(horses)
            res.render('profile', { user : req.user, horses: horses });
        })
        .catch(err => { console.error(err)});
    
});

router.get('/owner/:id', (req, res) => {
    if(!req.user){
        return res.redirect("/")
    }
    Horse
        .find({owner: req.params.id})
        .exec()
        .then(horses => {
            res.render('owner', { user : req.user, horses: horses });
        })
        .catch(err => { console.error(err)});
    
});

router.get('/horse/:id', (req, res) => {
    console.log("random horse", req.params)
    Horse
        .findOne({_id: req.params.id})
        .exec()
        .then(horse => {
            console.log('dog')
            console.log(horse)
            res.render('horse', { user : req.user, horse: horse });
        })
        .catch(err => { console.error(err)});
})
router.post('/add-horse', (req, res) => {
    console.log('hello horse', req.body, req.user)
    var h = new Horse({horsename: req.body.horsename, owner: req.user._id })
    h.save(function(err) {
        if (err)
           throw err;
        else 
           console.log('save user successfully...');
    });
    //Horse.create({horsename: 'buttercup2'})
    //res.render('profile', { user : req.user });
    res.redirect('/profile')
})

router.post('/horse/:id', (req, res) => {
    console.log(req.path, req.url, req.originalUrl, req.baseUrl, req.params.id)
    
    console.log(req.body.entry)
    var o = new Entry({entry: req.body.entry, writtenBy: req.user._id})
    o.save(function(err) {
        if (err)
           throw err;
        else 
           console.log('save user successfully...');
    });
    res.redirect('/profile')


})

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/profile');
            });
        });
    });
});


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/profile');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;
