var mongoose = require('mongoose');

exports.nameSchema = new mongoose.Schema({
  company: { type: String, required: true }
});