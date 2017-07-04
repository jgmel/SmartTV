/**
 * Created by strobil on 25.04.17.
 */

(function () {
    app.directive('ngLoading', function ($http, $timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $el, $attrs) {

                $scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                $scope.$watch($scope.isLoading, function (loading) {
                    if (loading) {
                        $el.removeClass('ng-hide');
                    } else {
                        $el.addClass('ng-hide');
                    }
                });
            }
        }
    });
})();