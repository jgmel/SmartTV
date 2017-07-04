(function () {
    "use strict";

    window.Key = function ($scope, $element, $attrs) {
        $element.bind('click', function () {
            $scope.$emit(Key.PRESSED, $attrs.ngKey);
        });
    };

    Key.PRESSED = "Key.PRESSED";

    app.directive('ngKey', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                new Key($scope, $element, $attrs);
            }
        };
    });
})();
