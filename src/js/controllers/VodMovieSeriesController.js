/**
 * Created by strobil on 05.05.17.
 */

app.controller('VodMovieSeriesController', function ($scope, $stateParams, $timeout, $interval, MediaServerService) {
    $scope.currentPage = 1;
    $scope.itemsPerPage = 8;
    $scope.pageCount = 1;

    $scope.movieId = parseInt($stateParams.movieId);

    $scope.pageUp = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage -= 1;
            $timeout(function () {
                $$nav.on($('.container:last'), $('li:last'));
            }, 200, false);
        }
    };

    $scope.pageDown = function () {
        if ($scope.currentPage < $scope.pageCount) {
            $scope.currentPage += 1;
            $timeout(function () {
                $$nav.on($('.container:last'), $('li:first'));
            }, 200, false);
        }
    };

    MediaServerService.GetMovieInfo([$scope.movieId])
        .then(function (response) {
            $scope.movie = response[0];

            if (angular.isArray($scope.movie.releases)) {

                var interval = $interval(function() {
                    if (parseInt($('li').length) > 1) {
                        $$nav.on($('.container:last'), $('li:first'));
                        $interval.cancel(interval);
                    }
                }, 20, 0, false);
            }
        });
});
