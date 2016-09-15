angular.module('App')
    .component('contacts', {
        templateUrl: 'views/contacts.html',
        controller:  function ContactsCtrl($rootScope, $scope, Contacts) {
            ctrl = this;
            ctrl.fields = [
                  { title:' Phone Number',name:'phone_number',}
                , { title: 'Email', name:'email'}
                , { title: 'Company', name: 'company'}
                , { title: 'Job Title', name: 'job_title' },
                ]
            this.contacts = Contacts.GetContacts();
            this.active_contact;
            this.edit = function(contact) {
                this.active_contact = contact;
                $rootScope.$emit('app.display.contact.editor', contact)
            }

            this.new = function() {
                $rootScope.$emit('app.add.contact');
            }

            this.delete = function(contact) {
                Contacts.DeleteContact(contact);
            }
            $scope.$on('remote.save.contact', function(event, contact) {
                Contacts.SaveContact(contact)
                .then(function(contact){
                    //reactive the model
                    ctrl.active_contact = contact;
                });
            })
        }
    })
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('contacts', {
            url: '/contacts',
            template: '<contacts></contacts>'
        });
}  