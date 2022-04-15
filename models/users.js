var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var tripSchema = new mongoose.Schema({
	departure: String,
	arrival: String,
	date: Date,
	departureTime: String,
	price: Number,
	id: String,
});

var userSchema = mongoose.Schema({
	name: String,
	firstName: String,
	email: String,
	password: String,
	lasttrip: [tripSchema],
});

userSchema.pre('save', function (next) {
	const user = this;

	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (saltError, salt) {
			if (saltError) {
				return next(saltError);
			} else {
				bcrypt.hash(user.password, salt, function (hashError, hash) {
					if (hashError) {
						return next(hashError);
					}
					user.password = hash;
					next();
				});
			}
		});
	} else {
		return next();
	}
});

userSchema.methods.comparePassword = function (password, callback) {
	bcrypt.compare(password, this.password, function (error, isMatch) {
		if (error) {
			return callback(error);
		} else {
			callback(null, isMatch);
		}
	});
};

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
