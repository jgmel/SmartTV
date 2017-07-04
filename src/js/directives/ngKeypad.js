(function () {
    "use strict";

    window.Keypad = function ($scope) {
        $scope.$on(Key.PRESSED, function (event, key) {
            if (key.indexOf('[') === -1 && key.indexOf(']') === -1) {
                $scope.$emit(Keypad.KEY_PRESSED, key);
            } else {
                $scope.$emit(Keypad.MODIFIER_KEY_PRESSED, key.substring(1, key.length - 1));
            }
        });
    };

    Keypad.KEY_PRESSED = "Keypad.KEY_PRESSED";
    Keypad.MODIFIER_KEY_PRESSED = "Keypad.MODIFIER_KEY_PRESSED";

    app.directive('ngKeyboard', function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'templates/keyboard/numeric.html',
            replace: true,
            transclude: true,
            link: function ($scope, $element, $attrs) {
                new Keypad($scope, $element, $attrs, $rootScope);
            }
        }
    });
})();