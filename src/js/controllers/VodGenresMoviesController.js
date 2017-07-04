/**
 * Created by strobil on 25.04.17.
 */

app.controller('VodGenresMoviesController', function ($scope, $state, $stateParams, $timeout, MediaServerService) {

    $scope.sortMode = 0;
    $scope.genreId = parseInt($stateParams.genreId);

    $scope.currentPage = 1;
    $scope.itemsPerPage = 8;
    $scope.pageCount = 1;

    $scope.movieInfoLoaded = false;

    $scope.pageUp = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage -= 1;
            $timeout(function () {
                $$nav.on(null, $('.movies li:last'));
            }, 200, false);
        }
    };

    $scope.pageDown = function () {
        if ($scope.currentPage < $scope.pageCount) {
            $scope.currentPage += 1;
            $timeout(function () {
                $$nav.on(null, $('.movies li:first'));
            }, 200, false);
        }
    };

    $scope.loadGenreMovies = function () {
        MediaServerService.GetGenreMovies($scope.genreId, $scope.sortMode)
            .then(function (response) {
                if (angular.isArray(response)) {
                    MediaServerService.GetMovieInfo(response)
                        .then(function (response) {
                            if (angular.isArray(response)) {
                                $scope.movies = response;
                                $scope.movieInfoLoaded = true;
                                $scope.pageCount = Math.ceil($scope.movies.length / $scope.itemsPerPage);
                            }
                        });
                }
            });
    };

    $scope.loadGenreMovies();
});