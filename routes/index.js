var express = require('express');
var router = express.Router();

var journey = require('../models/journeys');
var lasttrip = require('../models/lasttrip');
var userModel = require('../models/users');

var ticket = [];

function upperFirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase();
}

/* GET LOGIN PAGE */
router.get('/', function (req, res, next) {
	res.render('login');
});

/* GET HOMEPAGE */
router.get('/homepage', async function (req, res, next) {
	if (req.session.user == null) {
		res.redirect('/');
	} else {
		var lasttrips = await lasttrip.find();
		res.render('homepage', { lasttrips });
	}
});

/* GET ERRORS */
router.get('/notrain', function (req, res, next) {
	res.render('errors');
});

/* GET TICKET-FOUND */
router.post('/ticketfound', async function (req, res, next) {
	var tickets = await journey.find({
		departure: upperFirst(req.body.departure),
		arrival: upperFirst(req.body.arrival),
		date: req.body.date,
	});
	if (tickets.length == 0) {
		res.render('notrain');
	} else {
		res.render('ticketfound', { tickets });
	}
});

/* GET CHECKOUT */
router.get('/checkout', async function (res, req, next) {
	var status = false;
	var userSession = req.session.user;

	for (var i = 0; i < ticket.length; i++) {
		if (req.query.id == ticket[i].id) {
			status = true;
		}
	}
	if (status == false) {
		ticket.push({
			departure: req.query.departure,
			arrival: req.query.arrival,
			departureTime: req.query.departureTime,
			date: req.query.date,
			price: req.query.price,
			id: req.query.id,
			iduser: userSession.id,
		});
	}
	res.render('checkout', { ticket });
});

/* GET LAST-TRIP */
router.get('/lasttrip', async function (req, res, next) {
	for (var i = 0; i < ticket.length; i++) {
		var saveLastTrip = new lasttrip({
			departure: ticket[i].departure,
			arrival: ticket[i].arrival,
			date: ticket[i].date,
			departureTime: ticket[i].departureTime,
			price: ticket[i].price,
			id: ticket[i].id,
			iduser: ticket[i].iduser,
		});
		await saveLastTrip.save();
	}

	var userSession = req.session.user;

	lasttrips = await lasttrip.find({ iduser: userSession.id });
	for (var i = 0; i < ticket.length; i++) {
		ticket.pop();
	}
	res.render('lasttrip', { lasttrips });
});

module.exports = router;
