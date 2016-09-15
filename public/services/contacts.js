angular.module('App')
.service('Contacts', ['$http', '$q', function($http, $q) {
    // --
    // Private Properties and Methods
    // --
    var _contacts_object = {} ;
    var _contacts = [] ;
    
    
    //Get Contacts from remote server
    $http({
      method: 'GET',
      url: '/api/list'
    }).then(function successCallback(response) {
        var contacts = response.data;
        for ( var i=0; i < contacts.length; i++) {
            _contacts.push(contacts[i]);
            _contacts_object[contacts[i]._id] = contacts[i];
        }
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });


    var socket = io();
        // add message to _messages when socket receives message from server
        socket.on('update_contact', function(contact){
        });

    // --
    // Public Methods
    // --
    return {
        /**
        * Returns a listing of contacts.
        *
        * @return  {Array}               - reference of private _contacts array.
        */

        GetContacts: function() {
            return _contacts
        },
        /**
        * Save contact information to remote server.
        *
        * @return  {Array}               - reference of private _contacts array.
        */
        SaveContact: function(contact) {
            var deferred = $q.defer();
            socket.emit('save_contact', contact, function(data){
                if ( contact._id) { //exsited contact object
                    _contacts_object[data._id].first_name = data.first_name;
                    _contacts_object[data._id].last_name = data.last_name;
                    _contacts_object[data._id].phone_number = data.phone_number;
                    _contacts_object[data._id].company = data.company;
                    _contacts_object[data._id].email = data.email;
                    _contacts_object[data._id].job_title = data.job_title;
                } else { 
                    // new contact
                    _contacts.push(data);
                    _contacts_object[data._id] = data;
                }
                deferred.resolve(_contacts_object[data._id]);
            });
            return deferred.promise;
        },

        DeleteContact: function(contact) {
            socket.emit('delete_contact', contact, function(err){
                if (!err){
                    delete _contacts_object[contact._id];
                    _contacts.splice(_contacts.indexOf(contact),1);
                }
            });
        }

    }

}])