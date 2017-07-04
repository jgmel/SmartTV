/**
 * Created by strobil on 27.02.17.
 */

app.controller('VodGenresController', function ($scope, $state, $timeout, $interval, MediaServerService) {
    $scope.currentPage = 1;
    $scope.currentItemIdx = 0;

    $scope.pageCount = 1;
    $scope.itemsPerPage = 8;

    $scope.lastItemSelected = null;


    $scope.pageUp = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage -= 1;
            $timeout(function () {
                $$nav.on($('.container:last'), $('.genres li:last'));
            }, 200, false);
        }
    };

    $scope.pageDown = function () {
        if ($scope.currentPage < $scope.pageCount) {
            $scope.currentPage += 1;
            $timeout(function () {
                $$nav.on($('.container:last'), $('.genres li:first'));
            }, 200, false);
        }
    };

    $scope.loadGenres = function () {
        MediaServerService.GetGenres()
            .then(function () {
                $scope.genres = MediaServerService.Data.get('genres');
                $scope.pageCount = Math.ceil($scope.genres.length / $scope.itemsPerPage);

                if (angular.isObject(Pages.VodGenres)) {
                    $scope.currentPage = Pages.VodGenres.current_page || 1;
                    $scope.currentItemIdx = Pages.VodGenres.current_item_idx || 0;

                    $timeout(function () {
                        $scope.$apply()
                    });
                }

                var interval = $interval(function() {
                    var menuItems = $('li');

                    if (parseInt(menuItems.length) > 1) {

                        $timeout(function () {
                            var idx = $scope.currentItemIdx;
                            if (menuItems.length < $scope.currentItemIdx+1) {
                                idx = menuItems.length-1;
                            }
                            $$nav.on($('.container:last'), menuItems[idx]);
                        });

                        $interval.cancel(interval);
                    }
                }, 100, 0, false);

            }, function () {
                $state.go('auth', {return_to: $state.current});
            });
    };

    $scope.cancelLoading = function () {
        $timeout.cancel($scope.openGenreTimeout);
    };

    $scope.openGenre = function (_genre_id, index) {
        $scope.currentItemIdx = index;
        $scope.cancelLoading();
        $scope.openGenreTimeout = $timeout(function () {
            $scope.genreId = _genre_id;
            $state.go("vod.genres.movies", {genreId: $scope.genreId});
        }, 650, false);
    };

    $scope.loadGenres();

    $scope.$on('$destroy', function () {
        $timeout.cancel($scope.openGenreTimeout);
        Pages.VodGenres = {
            current_page: $scope.currentPage,
            current_item_idx: $scope.currentItemIdx
        };
    });

    $$nav.on();
});