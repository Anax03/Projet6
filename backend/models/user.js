const mongo = require('mongoose');
const userValidator = require('mongoose-unique-validator');

/// Shema User , email password
const ShemaUser = mongo.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/// Plugin autorise de créer un compte utilisateur par un seul email
ShemaUser.plugin(userValidator);

module.exports = mongo.model('User', ShemaUser);
