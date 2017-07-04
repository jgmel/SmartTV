/**
 * Created by strobil on 27.02.17.
 */

app.controller('VodMovieController', function ($scope, $state, $stateParams, $timeout, MediaServerService) {

    $scope.loadMovieInfo = function () {
        $scope.movieId = parseInt($stateParams.movieId);
        if ($scope.movieId > 0) {

            MediaServerService.GetMoviePoster($scope.movieId)
                .then(function (response) {
                    $scope.poster = response;
                });

            MediaServerService.GetMovieInfo([$scope.movieId])
                .then(function (response) {
                    $scope.movie = response[0];

                    $scope.countries = [];
                    $scope.genres = [];

                    angular.forEach($scope.movie.countries, function(value, key) {
                        $scope.countries.push(value.name);
                    });

                    angular.forEach($scope.movie.genres, function(value, key) {
                        $scope.genres.push(value.title);
                    });

                    $timeout(function () {
                        $$nav.on(null, $('.button'));
                    }, 30, false);
                });
        }
    };

    $scope.openMovie = function () {
        if (angular.isArray($scope.movie.releases)) {

            if ($scope.movie.releases[0].links.length > 1) {
                $state.go('vod.movie.series', {movieId: $scope.movieId});
            } else {
                $state.go('vod.playback', {movieId: $scope.movieId});
            }
        }
    };

    $scope.shortenString = function (about, len) {
        if (about.length > 330) {
            return about.substr(0, 330)+'...';
        } else {
            return about;
        }
    };

    $scope.$on('$viewContentLoaded', function () {
       $timeout(function () {
           $$nav.on(null, $('.button'));
       }, 30)
    });

    $scope.loadMovieInfo();
});