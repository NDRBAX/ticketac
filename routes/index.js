var express = require('express');
var router = express.Router();

var journey = require('../models/journeys');
var lasttrip = require('../models/lasttrip');

var ticket = [];

function upperFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase();
}

/* GET LOGIN PAGE */
router.get('/', function(req, res, next) {
    res.render('login');
});

/* GET HOMEPAGE */
router.get('/homepage', async function(req, res, next) {
    if (req.session.user == null) {
        res.redirect('/');
    } else {
        var lasttrips = await lasttrip.find();
        res.render('homepage', { lasttrips });
    }
});

/* GET ERRORS */
router.get('/notrain', function(req, res, next) {
    res.render('errors');
});

/* GET TICKET-FOUND */
router.post('/ticketfound', async function(req, res, next) {
    var tickets = await journey.find({
        departure: upperFirst(req.body.departure),
        arrival: upperFirst(req.body.arrival),
        date: req.body.date,
    });
    if (tickets === null) {
        res.render('errors');
    }
    res.render('ticketfound', { tickets: tickets });
});

/* GET CHECKOUT */
router.get('/checkout', async function(res, req, next) {
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
router.get('/lasttrip', async function(req, res, next) {
    for (var i = 0; i < ticket.length; i++) {
        var saveLastTrip = new lasttrip({
            departure: ticket[i].departure,
            arrival: ticket[i].arrival,
            date: ticket[i].date,
            departureTime: ticket[i].departureTime,
            price: ticket[i].price,
            id: ticket[i].id,
            iduser: ticket[i].iduser
        })
        await saveLastTrip.save();
    };
    var userSession = req.session.user;
    lasttrips = await lasttrip.find({ iduser: userSession.id });
    for (var i = 0; i < ticket.length; i++) {
        ticket.pop()
    }
    res.render('lasttrip', { lasttrips });
});


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {
    // How many journeys we want
    var count = 300;

    // Save  ---------------------------------------------------
    for (var i = 0; i < count; i++) {
        departureCity = city[Math.floor(Math.random() * Math.floor(city.length))];
        arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))];

        if (departureCity != arrivalCity) {
            var newUser = new journeyModel({
                departure: departureCity,
                arrival: arrivalCity,
                date: date[Math.floor(Math.random() * Math.floor(date.length))],
                departureTime: Math.floor(Math.random() * Math.floor(23)) + ':00',
                price: Math.floor(Math.random() * Math.floor(125)) + 25,
            });

            await newUser.save();
        }
    }
    res.render('index', { title: 'Express' });
});

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {
    // Permet de savoir combien de trajets il y a par ville en base
    for (i = 0; i < city.length; i++) {
        journeyModel.find({ departure: city[i] }, //filtre

            function(err, journey) {
                console.log(
                    `Nombre de trajets au départ de ${journey[0].departure} : `,
                    journey.length,
                );
            },
        );
    }

    res.render('index', { title: 'Express' });
});

module.exports = router;