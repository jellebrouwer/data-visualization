(function () {
    'use strict';

    angular.module('visualizations', ['ngRoute'])
        .config(configFn)
        .run(runBlock);

    function configFn($routeProvider) {

        $routeProvider
            .when('/force', {
                template: '<force></force>'
            })
            .when('/time', {
                template: '<time></time>'
            })
            .otherwise('/force');
    }

    configFn.$inject = ['$routeProvider'];

    function runBlock($rootScope, $location) {
        $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
            $rootScope.$broadcast('route-changed', $location.path());
        });
    }

    runBlock.$inject = ['$rootScope', '$location'];


})();