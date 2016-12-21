(function () {
    'use strict';

    angular
        .module('visualizations')
        .component('forceSettings', {
            templateUrl: 'src/js/components/force/force-settings.html',
            controller: ForceSettingsController,
            controllerAs: 'forceSettingsCtrl',
            bindings: {
                config: '<',
                onConfigChange: '&',
            },
        });

    ForceSettingsController.inject = [];
    function ForceSettingsController() {
        var vm = this;
        vm.submit = submit;

        function submit() {
            vm.onConfigChange({ config: vm.config });
        }

        vm.onInit = function () { };
        vm.onChanges = function (changesObj) { };
        vm.onDestory = function () { };
    }
})();