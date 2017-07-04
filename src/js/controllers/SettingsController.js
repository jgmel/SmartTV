/**
 * Created by strobil on 18.11.16.
 */

"use strict";

app.controller('SettingsController', function($scope) {
    $scope.$on('$viewContentLoaded', function() { $$nav.on(); });
});
