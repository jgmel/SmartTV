/**
 * Created by strobil on 05.12.16.
 */
"use strict";

app.controller('AuthController', function ($scope, $state, TvServerService, DeviceService, $stateParams) {

    $scope.auth = function () {
        TvServerService.Auth()
            .then(function () {
                if ($stateParams.returnTo) {
                    $state.go("$stateParams.returnTo");
                } else {
                    $state.go("menu");
                }
            }, function () {
                $state.go("signup");
            });
    };

    $scope.$watch(function () {
        return DeviceService.ready();
    }, function (ready) {
        if (ready) {
            $scope.auth();
        }
    });
});