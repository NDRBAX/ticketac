var express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();

var userModel = require('../models/users');
/*
 * Quand vous arrivez sur le site vous devez voir une page Login s’afficher. Il s’agit d’un processus de Signin/Signup classique. Si un user existe, alors on peut renvoyer la homepage, sinon il faut créer le user.
 */

/* SIGNUP */
router.post('/sign-up', async function (req, res, next) {
	let userRule = req.body.nameFromFront;
	let passwordRule = req.body.passwordFromFront;

	var searchUser = await userModel.findOne({
		email: req.body.emailFromFront,
	});
	// Création du user s'il n'existe pas dans la BDD
	if (userRule.length == 0 || passwordRule.length == 0) {
		res.redirect('/');
	} else if (!searchUser) {
		var newUser = new userModel({
			name: req.body.nameFromFront,
			firstName: req.body.firstNameFromFront,
			email: req.body.emailFromFront,
			password: req.body.passwordFromFront,
		});
		var newUserSave = await newUser.save();
		req.session.user = {
			name: newUserSave.name,
			id: newUserSave._id,
		};
		res.redirect('/homepage');
	} else {
		res.redirect('/');
	}
});

/* SIGNIN */
router.post('/sign-in', async function (req, res, next) {
	var searchUser = await userModel.findOne({
		email: req.body.emailFromFront,
	});
	if (searchUser != null) {
		const validPassword = await bcrypt.compare(
			req.body.passwordFromFront,
			searchUser.password,
		);
		if (validPassword) {
			req.session.user = {
				name: searchUser.name,
				id: searchUser._id,
			};
			res.redirect('/homepage');
		} else {
			res.render('login');
		}
	}
});

/* LOGOUT */
router.get('/logout', function (req, res, next) {
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;
