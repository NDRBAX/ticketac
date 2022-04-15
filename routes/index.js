var express = require('express');
var router = express.Router();

var journey = require('../models/journeys');

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
		res.render('homepage');
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

/* ADD TICKET */
router.get('/add-ticket', async function (req, res, next) {
	const ticketId = req.query.ticketId;
	const ticket = await journey.findById(ticketId);
	if (req.session.tickets == null) {
		req.session.tickets = [];
		req.session.tickets.push(ticket);
	} else {
		req.session.tickets.push(ticket);
	}

	res.render('checkout', { tickets: req.session.tickets });
});

/* GET CHECKOUT */
router.get('/checkout', async function (req, res, next) {
	var status = false;

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
			iduser: req.session.user.id,
		});
	}
	res.render('checkout', { ticket });
});

/* ADD LASTTRIP */
router.get('/add-lasttrip', async function (req, res, next) {
	let user = await userModel.findById(req.session.user.id);
	req.session.tickets.forEach(el => user.lasttrip.push(el));
	await user.save();
	res.render('homepage');
});

/* GET LAST-TRIP */
router.get('/lasttrip', async function (req, res, next) {
	let user = await userModel.findById(req.session.user.id);
	let tickets = user.lasttrip;
	res.render('lasttrip', { tickets });
});

module.exports = router;
