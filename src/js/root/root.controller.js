(function () {
    'use strict';

    angular
        .module('visualizations')
        .controller('RootController', RootController);

    function RootController($scope) {
        var vm = this;

        $scope.$on('route-changed', function (event, args) {
            vm.activeTab = args.replace(/\//g, '')
        });

    }

    RootController.$inject = ['$scope'];

})();