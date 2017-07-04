/**
 * Created by strobil on 10.04.17.
 */

app.controller('PersonalCabController', function ($scope, $state, TvServerService) {
    $scope.data = null;

    $scope.goBack = function () {
        $state.go('menu');
    };

    TvServerService.GetUserInfo()
        .then(function (response) {
            $scope.data = response;
        });

    $scope.$on('$viewContentLoaded', function () {
        $$nav.on();
    });
});
