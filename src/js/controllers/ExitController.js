"use strict";

app.controller('ExitController', function ($scope, $state, DeviceService) {
    $scope.$on('$viewContentLoaded', function () {
        $$nav.on();
    });

    $scope.goBack = function () {
        $state.go('menu');
    };

    $scope.exit = function () {
        switch (DeviceService.sub_type()) {
            case "DST_LG":
                try {
                    webOS.platformBack();
                } catch (e) {
                }
                break;
            case "DST_SAMSUNG":
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch(e) {

                }
                break;
        }
    };
});