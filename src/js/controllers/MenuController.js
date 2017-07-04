/**
 * Created by strobil on 18.11.16.
 */

app.controller('MenuController', function ($scope, NgTimeManager) {
    $scope.$on('$viewContentLoaded', function () {
        $$nav.on();
    });
});