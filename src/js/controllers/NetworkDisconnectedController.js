/**
 * Created by strobil on 24.05.17.
 */

app.controller('NetworkDisconnectedController', function ($scope) {

    $scope.$on('$viewContentLoaded', function () {
        $$nav.on($('.container:last'));
    });
});