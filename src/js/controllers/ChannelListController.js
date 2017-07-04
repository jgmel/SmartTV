"use strict";

app.controller('ChannelListController', function ($scope, $state, $timeout, $interval, TvServerService) {

    $scope.currentPage = 1;
    $scope.currentItemIdx = 0;

    $scope.pageCount = 1;
    $scope.itemsPerPage = 8;

    $scope.channels = {};

    $scope.pageUp = function () {
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

    $scope.getChannels = function () {
        return TvServerService.Data.get('channels');
    };

    $scope.loadChannels = function () {
        TvServerService.GetChannels()
            .then(function () {
                $scope.onChannelsLoaded();
            });
    };

    $scope.onChannelsLoaded = function () {
        if ($scope.channels !== $scope.getChannels()) {

            $scope.channels = $scope.getChannels();
            $scope.pageCount = Math.ceil($scope.channels.list.length / $scope.itemsPerPage);

            if (angular.isObject(Pages.ChannelList)) {
                $scope.currentPage = Pages.ChannelList.current_page || 1;
                $scope.currentItemIdx = Pages.ChannelList.current_item_idx || 0;

                $timeout(function () {
                    $scope.$apply()
                });
            }

            var interval = $interval(function () {
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


        }
    };

    $scope.$watch($scope.getChannels, function () {
        $scope.loadChannels();
    });

    $scope.onChannelSelected = function (channel, index) {
        $scope.currentItemIdx = index;
    };

    $scope.$on('$destroy', function () {
        Pages.ChannelList = {
            current_page: $scope.currentPage,
            current_item_idx: $scope.currentItemIdx
        };
    });

    $scope.loadChannels();
});