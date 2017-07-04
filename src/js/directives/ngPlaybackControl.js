/**
 * Created by strobil on 05.05.17.
 */

app.directive('ngPlaybackControl', function ($interval, $timeout, $rootScope, KeyCodeService) {
    return {
        link: function ($scope, $el, $attrs) {

        },
        controller: function ($scope, PlayerService) {
            $scope.needHide = true;

            $timeout(function () {
                $rootScope.$broadcast("navbar:hide");
            });

            $scope.playbackControlVisible = false;
            $scope.hideTimeout = null;

            $scope.currentState = "";
            $scope.currentPlayTime = 0;
            $scope.currentPlayTimeHuman = "00:00";
            $scope.elapsedPlayTimeHuman = "00:00";

            var PlaybackSeeker = $('.playback-seeker');
            var PlaybackFill = $('.playback-fill');
            var ProgressBar = $('.playback-seek-bar');

            var min_value = 0;
            var max_value = ProgressBar.width();


            $scope.hide = function () {
                if ($scope.needHide) {
                    $timeout(function() { $scope.playbackControlVisible = false; });
                    $rootScope.$broadcast("navbar:hide");
                }
            };

            $scope.show = function () {
                $timeout(function () { $scope.playbackControlVisible = true; });
                $rootScope.$broadcast("navbar:show");
            };

            $(document.body).on('keydown.playback mousemove.playback', _.debounce( $scope.show, 3000, true));
            $(document.body).on('keydown.playback mousemove.playback', _.debounce( $scope.hide, 3000, false));

            $(document.body).on('keydown.playback', function (event) {
                console.log(event.keyCode);
                switch (event.keyCode) {
                    case KeyCodeService.VK_FF_RW:
                        $scope.moveBackward();
                        break;
                    case KeyCodeService.VK_FF_FW:
                        $scope.moveForward();
                        break;
                    case KeyCodeService.VK_Play:
                        $scope.play();
                        break;
                    case KeyCodeService.VK_Pause:
                        $scope.pause();
                        break;
                    case KeyCodeService.VK_Stop:
                        $scope.stop();
                        break;
                }
            });

            ProgressBar.click(function (event) {
                var offset = Math.floor(event.pageX - ProgressBar.position().left);
                var percent = Math.floor(offset * 100 / max_value);

                var duration = PlayerService.GetDuration();
                var pos = Math.floor(percent / 100 * duration);

                if (pos >= min_value) {
                    PlayerService.SeekTo(pos);
                }
            });

            $scope.getCurrentPlayTimeInPercent = function () {
                var percent = 0;
                var duration = PlayerService.GetDuration();

                if (duration > 0) {
                    percent = Math.floor($scope.currentPlayTime * 100 / duration);
                }

                return percent;
            };

            $scope.updatePlaybackSeekerPosition = function () {
                var percent = $scope.getCurrentPlayTimeInPercent();
                var pos = Math.floor(percent * max_value / 100);

                if (pos >= min_value && pos <= max_value) {
                    PlaybackFill.css({width: percent+'%'});
                    PlaybackSeeker.css({left: pos});
                }
            };


            $scope.moveForward = function () {
                PlayerService.MoveForward(2*60*1000);
            };

            $scope.moveBackward = function () {
                PlayerService.MoveBackward(2*60*1000);
            };

            $scope.showPlayButton = function () {
                return $scope.currentState !== 'PLAYING' && $scope.currentState !== 'IDLE';
            };

            $scope.showPauseButton = function () {
                return $scope.currentState !== 'PAUSED';
            };


            $scope.play = function () {
                if (PlayerService.GetCurrentState() === 'PAUSED' || PlayerService.GetCurrentState() === 'IDLE') {
                    PlayerService.Resume();
                } else {
                    PlayerService.Pause();
                }
            };

            $scope.pause = function () {
                PlayerService.Pause();
            };

            $scope.stop = function () {
                PlayerService.Stop();
                $rootScope.$broadcast("player:streamcompleted");
            };

            $scope.$watch(PlayerService.GetCurrentState, function (state) {
                $scope.currentState = state;
            });

            $scope.$on("player:currentplaytime", function (event, params) {
                $timeout(function () {
                    $scope.currentPlayTime = params;
                    $scope.elapsedPlayTime = Math.floor(PlayerService.GetDuration() - $scope.currentPlayTime);

                    $scope.currentPlayTimeHuman = moment.utc(params).format("HH:mm");
                    $scope.elapsedPlayTimeHuman = moment.utc($scope.elapsedPlayTime).format("HH:mm");
                });

                $scope.updatePlaybackSeekerPosition();
            });

            $scope.$on("player:playbackerror", function () {
                try {
                    window.history.back();
                } catch (e) {

                }
            });

            $scope.$on("player:streamcompleted", function () {
                try {
                    window.history.back();
                } catch (e) {

                }
            });

            $scope.$on('$destroy', function () {
                $scope.needHide = false;
                $(document.body).off('.playback');
                $rootScope.$broadcast("navbar:show");
            });

            var interval = $interval(function() {
                if (parseInt($('.button').length) > 1) {
                    $$nav.on($('.container:last'));
                    $interval.cancel(interval);
                }
            }, 100, 0, false);
        },
        templateUrl: "templates/directives/ngPlaybackControl.html",
        replace: true,
        transclude: true
    }
});