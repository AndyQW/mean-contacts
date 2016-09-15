var App = angular.module('App',['ui.router', 'ngMaterial', 'formly'])
    .component('app', {
        templateUrl: 'views/app.html',
        controller: function($rootScope){
            var $ctrl = this;

            $ctrl.displayModal = function(component_name) {
                $('#modal_'+component_name).modal('show');
            }

            $ctrl.hideModal = function(component_name) {
                $('#modal_'+component_name).modal('hide');
            }
                        
            $rootScope.$on('app.display.contact.editor', function(event, event_data) {
                $ctrl.displayModal('contactEditor');
                $rootScope.$broadcast('contactEditor.display', event_data);
            });

            $rootScope.$on('app.hide.contact.editor', function(event, event_data) {
                $ctrl.hideModal('contactEditor');
            });

            $rootScope.$on('app.contact.save', function(event, event_data) {
                $rootScope.$broadcast('remote.save.contact', event_data);
            })

            $rootScope.$on('app.add.contact', function(event) {
                $ctrl.displayModal('contactEditor');
                $rootScope.$broadcast('contactEditor.new');
            })
        }
    })
    .run(function(formlyConfig) {
        formlyConfig.setType({
          name: 'input',
          template: '<input ng-model="model[options.key]">'
        });
        
        formlyConfig.setType({
          name: 'checkbox',
          template: '<md-checkbox ng-model="model[options.key]">{{to.label}}</md-checkbox>'
        });
        
        formlyConfig.setWrapper({
          name: 'mdLabel',
          types: ['input'],
          template: '<label>{{to.label}}</label><formly-transclude></formly-transclude>'
        });
        
        formlyConfig.setWrapper({
          name: 'mdInputContainer',
          types: ['input'],
          template: '<md-input-container><formly-transclude></formly-transclude></md-input-container>'
        });
        // having trouble getting icons to work.
        // Feel free to clone this jsbin, fix it, and make a PR to the website repo: https://github.com/formly-js/angular-formly-website
        formlyConfig.templateManipulators.preWrapper.push(function(template, options) {
          if (!options.data.icon) {
            return template;
          }
          return '<md-icon class="step" md-font-icon="icon-' + options.data.icon + '"></md-icon>' + template;
        });
    })
    .controller('MainController',[ function(){
        
    }])

    .config(config);
 
function config($locationProvider, $urlRouterProvider) {
    'ngInject';
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/contacts');
};