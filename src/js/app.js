(function () {
    'use strict';

    angular.module('visualizations', ['ngRoute'])
        .config(configFn);

    function configFn($routeProvider) {

        $routeProvider
            .when('/', {
                template: '<h2>Home</h2>'
            })
            .when('/force', {
                template: '<force></force>'
            })
            .when('/time', {
                template: '<time></time>'
            })
            .otherwise('/');
    }

    configFn.$inject = ['$routeProvider'];


})();