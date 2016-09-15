"use strict";

// ----------------
//   Dependencies
// ----------------

var Express     = require('express');
var HTTP        = require('http');
var Path        = require('path');
var Colors      = require('colors');
var Config      = require('./config.json')[process.env.APP_ENV || 'development'];

// ----------------------
//   Express Middleware
// ----------------------

var CookieParser  = require('cookie-parser');
var BodyParser    = require('body-parser');
var Flash         = require('connect-flash');
var Favicon       = require('serve-favicon');
var Static        = require('serve-static');
var Session       = require('express-session');
var Compression   = require('compression');
var Mongoose      = require('mongoose');
var Bluebird      = require('bluebird');
var Async         = require('async');
var ErrorHandler  = require('errorhandler');
var Nconf         = require('nconf');

// ----------------------
//   Express Controllers
// ----------------------

var Controller    = require('./controllers/index');

// ----------------------
//   Data Object
// ----------------------


var Contacts      = require('./controllers/contacts');
var ContactSchema       = require('./models/contact');  


// -----------------
//   Configuration
// -----------------

Nconf.argv()
   .env()
   .file({ file: './config.json' });


var ExpServer = Express();
ExpServer.set('port', Config.port);
ExpServer.set('views', Path.join(__dirname, 'views'));
ExpServer.set('view engine', 'ejs');

ExpServer.use(BodyParser.json());
ExpServer.use(BodyParser.urlencoded({ extended: true }));
ExpServer.use(CookieParser('helloworld'));
ExpServer.use(Session({
    secret: 'helloworld',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}));
ExpServer.use(Flash());
ExpServer.use(Static(Path.join(__dirname, 'public')));
ExpServer.use(Compression());
ExpServer.use(ErrorHandler({ dumpExceptions: true, showStack: true }));

// -------------------
//   Content Routing
// -------------------
            Controller._routes().forEach(function(route) {
                var action = route[0];
                route.splice(0, 1);
                ExpServer[action].apply(ExpServer, route);
            });

Mongoose.Promise = Bluebird;
Mongoose.connect('mongodb://localhost:27017/contacts');

var WebServer = HTTP.createServer(ExpServer)

var IO = require('socket.io')(WebServer);

// -------------------
//   Socket IO
// -------------------

IO.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('save_contact', function(contact_data, callback) {
        if ( contact_data._id ) {
            ContactSchema.findById( contact_data._id,  function( err, contact) {
                contact.first_name = contact_data.first_name;
                contact.last_name = contact_data.last_name;
                contact.email = contact_data.email;
                contact.phone_number = contact_data.phone_number;
                contact.company = contact_data.company;
                contact.job_title = contact_data.job_title;
                contact.save(function(err){
                    callback(contact);
                });
            });
        } else {
            var contact = new ContactSchema(contact_data);
            contact.save(function(err){
                callback(contact);
            });
        };
        
        console.log('socket.on save.contact');
    });

    socket.on('delete_contact', function(contact_data, callback) {
        ContactSchema.findById( contact_data._id, function( err, contact) {
            contact.remove(function(err){
                callback(err);
            });
        })
    })

});



WebServer.listen(ExpServer.get('port'), function() {
    console.log('Started Listening on port: '.green + ExpServer.get('port'));
});

