angular.module('App')
  .component('contactEditor', {
    templateUrl: 'views/contactEditor.html',
    controller: function contactEditorController($rootScope, $scope){
        var $ctrl = this;

        $ctrl.contact = {};
        $ctrl.options = {};
        
        // An array of our form fields with configuration
        // and options set. We make reference to this in
        // the 'fields' attribute on the  element
        $ctrl.contactFields = [
            {
                key: 'first_name',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'First Name',
                    placeholder: 'Enter your first name',
                    required: false
                }
            },
            {
                key: 'last_name',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'Last Name',
                    placeholder: 'Enter your last name',
                    required: false
                }
            },
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: 'Email address',
                    placeholder: 'Enter email',
                    required: false
                }
            },
            {
                key: 'phone_number',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'Mobile Phone',
                    placeholder: 'Enter mobile phone',
                    required: false
                }
            },
            {
                key: 'company',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'Company',
                    placeholder: 'Enter Company Name',
                    required: false
                }
            },
            {
                key: 'job_title',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'Job Title',
                    placeholder: 'Enter Job Title',
                    required: false
                }
            },

        ];

        $scope.$on('contactEditor.display', function(event, event_data) {
            $ctrl.org_contact = event_data;
            if ( event_data ) {
                $ctrl.contact = angular.copy(event_data);
            } else {
                $ctrl.contact = {};
            }
        });

        $scope.$on('contactEditor.new', function(event) {
            $ctrl.contact = {};
        });

        // Save Contact to remote ExpServer
        $ctrl.ok = function(contact) {
            $rootScope.$emit('app.contact.save', contact);
            $rootScope.$emit('app.hide.contact.editor');    
        };

        $ctrl.cancel = function() {
            $rootScope.$emit('app.hide.contact.editor');
        }
    }
  });