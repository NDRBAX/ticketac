var express = require('express');
var router = express.Router();

var userModel = require('../models/users')
    /*
     * Quand vous arrivez sur le site vous devez voir une page Login s’afficher. Il s’agit d’un processus de Signin/Signup classique. Si un user existe, alors on peut renvoyer la homepage, sinon il faut créer le user.
     */

/* SIGNUP */
router.post('/sign-up', async function(req, res, next) {
    var searchUser = await userModel.findOne({
            email: req.body.emailFromFront
        })
        // Création du user s'il n'existe pas dans la BDD
    if (!searchUser) {
        var newUser = new userModel({
            Name: req.body.nameFromFront,
            FirstName: req.body.firstNameFromFront,
            email: req.body.emailFromFront,
            password: req.body.passwordFromFront,
        })
        var newUserSave = await newUser.save();
        req.session.user = {
            name: newUserSave.name,
            id: newUserSave._id,
        }
        console.log(req.session.user)
        res.redirect('/homepage')
    } else {
        res.redirect('/')
    }
})

/* SIGNIN */
router.post('/sign-in', async function(req, res, next) {
    var searchUser = await userModel.findOne({
        email: req.body.emailFromFront,
        password: req.body.passwordFromFront
    })
    if (searchUser != null) {
        req.session.user = {
            name: searchUser.name,
            id: searchUser._id
        }
        res.redirect('/homepage');
    } else {
        res.render('login')
    }
});

module.exports = router;