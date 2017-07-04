/**
 * Created by strobil on 03.03.17.
 */
app.controller('VodPlaybackController', function ($scope, $interval, $state, $stateParams, MediaServerService, PlayerService) {

    $scope.movieId = parseInt($stateParams.movieId);

    $scope.play = function () {
        MediaServerService.GetMovieInfo([$scope.movieId])
            .then(function (response) {
                $scope.movie = response[0];

                if (angular.isArray($scope.movie.releases)) {
                    var releaseId = $scope.movie.releases[0].id;
                    var linkId = $scope.movie.releases[0].links[0].id;

                    MediaServerService.GetMovieLink($scope.movieId, releaseId, linkId)
                        .then(function (url) {
                            PlayerService.Play(url);
                        });
                }
            });
    };

    if ($scope.movieId > 0) {
        $scope.play();
    }

    $scope.$on('$destroy', function () {
        PlayerService.Stop();
    });
});