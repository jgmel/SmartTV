"use strict";

app.controller('ChannelPlaybackController', function ($rootScope, $scope, $state, $stateParams, $timeout, TvServerService, PlayerService, DeviceService, KeyCodeService) {

    $scope.playbackUrl = "";
    $scope.channelId = parseInt($stateParams.channelId);
    $scope.channels = TvServerService.Data.get('channels');

    $scope.needHide = true;

    $scope.showTimeout = $timeout(function () {
        $rootScope.$broadcast("navbar:hide");
    }, 3000);

    $scope.play = function () {
        TvServerService.OpenStream($scope.channelId, 0)
            .then(function (response) {
                $scope.playbackUrl = "http://" + response.http_stream.host.address + ":" + response.http_stream.host.port + response.http_stream.url;

                console.log(response);
                //fix )))))
                if (DeviceService.sub_type() === "DST_LG" && response.scheme === "HTTP_HLS") {
                    $scope.playbackUrl = $scope.playbackUrl + ".m3u8";
                }

                PlayerService.Play($scope.playbackUrl);

                var idx = $scope.findChannelIdx();
                var title = $scope.channels.list[idx].name;

                $rootScope.$broadcast("navbar:set_title", title);
            });
    };

    $scope.hide = function () {
        if ($scope.needHide) {
            $rootScope.$broadcast("navbar:hide");
        }
    };

    $scope.show = function () {
        $rootScope.$broadcast("navbar:show");
    };

    $scope.findChannelIdx = function () {
        var result = 0;

        for (var i = 0; i <= $scope.channels.list.length - 1; i++) {
            if ($scope.channels.list[i].id === $scope.channelId) {
                result = i;
                break;
            }
        }

        return result;
    };

    $scope.channelUp = function () {
        var idx = $scope.findChannelIdx($scope.channelId) - 1;

        if ($scope.channels.list[idx]) {
            $state.go('channels.playback', {channelId: $scope.channels.list[idx].id})
        }
    };

    $scope.channelDown = function () {
        var idx = $scope.findChannelIdx($scope.channelId) + 1;

        if ($scope.channels.list[idx]) {
            $state.go('channels.playback', {channelId: $scope.channels.list[idx].id})
        }
    };

    $scope.onKeyDown = function (event) {
        switch (event.keyCode) {
            case KeyCodeService.VK_ArrowUp:
                $scope.channelUp();
                break;
            case KeyCodeService.VK_ArrowDown:
                $scope.channelDown();
                break;
        }
    };

    $scope.registerKeyDown = function () {
        $(document.body).bind("keydown.channel_playback", _.debounce($scope.onKeyDown, 400, true));
        $(document.body).on('keydown.channel_playback mousemove.playback', _.debounce( $scope.show, 3000, true));
        $(document.body).on('keydown.channel_playback mousemove.playback', _.debounce( $scope.hide, 3000, false));
    };

    $scope.unRegisterKeyDown = function () {
        $(document.body).unbind(".channel_playback");
        $(document.body).off('.channel_playback');
    };

    $scope.registerKeyDown();

    $scope.$on('$destroy', function () {
        $scope.needHide = false;
        $rootScope.$broadcast("navbar:show");
        PlayerService.Stop();
        $scope.unRegisterKeyDown();
        $timeout.cancel($scope.showTimeout);
    });

    $timeout(function () {
        $$nav.on($('.container:last'))
    });

    $scope.play();
});