'use strict';

// ----------------
//   Dependencies
// ----------------

let Config       = require('../config.json')[process.env.APP_ENV || 'development'];
let Contacts     = require('./contacts');
// -----------
//   Routing
// -----------

/**
 * Controller for Index Pages.
 *
 * @module "controllers/index"
 */
module.exports = {

    // --
    // Routing
    // --

    _routes: function () {
        return [
            ['get', '/api/list', this.List],
            ['get', '/*', this.Index]
        ];
    },

    // --
    // Endpoints
    // --

    /**
     * The Application Homepage
     *
     * @param   {obj}   req     - Node request object
     * @param   {obj}   res     - Node response object
     * @returns {null}          - Null
     */
    Index: function(req, res) {
        
        

                                res.render('index/index', {
                                    path: Config.url,
                                    config: Config,
                                    session: req.session,
                                    flash: req.flash(),
                                    title: 'Contacts Sample Appication',
                                });
        
    },

    List: function(req, res) {
        Contacts.list(function(error, result){
            res.send(result);    
        })
        

    }

};
