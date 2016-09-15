
'use strict';

var Mongoose    = require('mongoose');
var Contact     = require('../models/contact');

( function(Contacts) {
    Contacts.list = function(callback) {
        console.log(Contact);
        Contact.find({}).exec(callback)
    }

    Contacts.update = function(id, contact) {
        Contact.update({ _id: id },{ $set:contact });
    }
}(exports))