(function () {
    'use strict';

    angular
        .module('visualizations')
        .controller('RootController', RootController);

    function RootController($scope, forceDefaultConfig) {
        var vm = this;

        vm.config = forceDefaultConfig;

        $scope.$on('route-changed', function (event, args) {
            vm.activeTab = args.replace(/\//g, '')
        });

        vm.renderForceDiagram = renderForceDiagram;

        function renderForceDiagram(config) {
            vm.config = angular.copy(config);
        }

    }

    RootController.$inject = ['$scope', 'forceDefaultConfig'];

})();