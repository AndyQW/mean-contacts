'use strict';

var Mongoose = require('mongoose');

// Create a schema
var ContactSchema = new Mongoose.Schema({
    first_name: String,
    last_name: String,
    company: String,
    phone_number: String,
    job_title: String,
    updated_at: { type: Date, default: Date.now },
});

module.exports = Mongoose.model('contacts', ContactSchema);