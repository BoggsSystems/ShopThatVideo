'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

exports.getSettings = function(req, res) {
  res.send({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    upload_preset : process.env.CLOUDINARY_UPLOAD_PRESET 
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.approved = false;
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    // res.json({ token: token });
    res.json({ message: 'account created', approved: user.approved});
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Deactivate a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findOne({ _id: req.params.id, active: true }, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('User not found or deactivated!');
    user.active = false;
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.status(200).send(user);
    });
  });
};

/**
 * Activate a user
 * restriction: 'admin'
 */
exports.activate = function(req, res) {
  User.findOne({ _id: req.params.id, active: false }, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('User not found or already active!');
    user.active = true;
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.status(200).send(user);
    });
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
