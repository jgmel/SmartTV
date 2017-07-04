/**
 * Created by strobil on 17.01.17.
 */

(function () {
    app.service('PlayerService', function (DeviceService, $rootScope) {
        var lastUrl;
        var currentPlayTime = 0;
        var video = null;

        var _Player = function ($rootScope) {
            var avplayListener = {
                onbufferingstart: function () {
                    $rootScope.$broadcast("player:bufferingstart");
                },
                onbufferingprogress: function (percent) {
                    $rootScope.$broadcast("player:bufferingprogress", percent);
                },
                onbufferingcomplete: function () {
                    $rootScope.$broadcast("player:bufferingcomplete");
                },
                oncurrentplaytime: function (currentTime) {
                    $rootScope.$broadcast("player:currentplaytime", currentTime);
                    currentPlayTime = currentTime;
                },
                onevent: function (eventType, eventData) {
                    // console.log("event type error : " + eventType + ", data: " + eventData);
                },
                onerror: function (eventType) {
                    $rootScope.$broadcast("player:playbackerror", eventType);
                },
                onsubtitlechange: function (duration, text, data3, data4) {
                    // console.log("Subtitle Changed.");
                },
                ondrmevent: function (drmEvent, drmData) {
                    // console.log("DRM callback: " + drmEvent + ", data: " + drmData);
                },
                onstreamcompleted: function () {
                    $rootScope.$broadcast("player:streamcompleted");
                }
            };

            function Init() {
                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        $('#player').append('<object id="video" type="application/avplayer"></object>');
                        try {
                            webapis.avplay.setListener(avplayListener);
                        } catch (e) {
                        }
                        break;
                    case "DST_BROWSER":
                    case "DST_LG":
                        $('#player').append("<video></video>");

                        video = $('video')[0];

                        video.addEventListener("timeupdate", function () {
                            currentPlayTime = video.currentTime * 1000;
                            $rootScope.$broadcast("player:currentplaytime", currentPlayTime);
                        });

                        video.addEventListener("error", function () {
                            $rootScope.$broadcast("player:playbackerror");
                        });

                        video.addEventListener("ended", function () {
                            $rootScope.$broadcast("player:streamcompleted");
                        });

                        break;
                }
            }

            Init();
        };


        var Player = new _Player($rootScope);

        return {
            Play: function (url) {
                lastUrl = url;

                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        try {
                            if (webapis.avplay.getState() !== "NONE")
                                this.Stop();

                            webapis.avplay.open(lastUrl);
                            webapis.avplay.prepareAsync(function () {
                                var screenInfo = DeviceService.displayInfo();
                                if (angular.isObject(screenInfo)) {
                                    webapis.avplay.setDisplayRect(0, 0, screenInfo.resolutionX, screenInfo.resolutionY);
                                    webapis.avplay.play();
                                }
                            });
                        } catch (e) {

                        }
                        break;
                    case "DST_BROWSER":
                    case "DST_LG":
                        video.src = url;
                        video.play();
                        break;
                }
            },
            Resume: function () {
                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        try {
                            webapis.avplay.play();
                        } catch (e) {

                        }
                        break;
                    case "DST_LG":
                        video.play();
                        break;
                }
            },
            Stop: function () {
                currentPlayTime = 0;

                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        try {
                            webapis.avplay.stop();
                        } catch (e) {
                        }
                        break;
                    case "DST_LG":
                        video.pause();
                        break;
                }
            },
            Pause: function () {
                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        try {
                            if (webapis.avplay.getState() === "PAUSED") {
                                webapis.avplay.play();
                            } else {
                                webapis.avplay.pause();
                            }
                        } catch (e) {
                        }
                        break;
                    case "DST_LG":
                        if (video.paused) {
                            video.play();
                        } else {
                            video.pause();
                        }
                        break;
                }
            },
            MoveForward: function (ms) {
                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        try {
                            webapis.avplay.jumpForward(ms);
                        } catch (e) {
                        }
                        break;
                    case "DST_LG":
                        video.currentTime = (currentPlayTime + ms) / 1000;
                        break;
                }
            },
            MoveBackward: function (ms) {
                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        try {
                            webapis.avplay.jumpBackward(ms);
                        } catch (e) {
                        }
                        break;
                    case "DST_LG":
                        video.currentTime = (currentPlayTime - ms) / 1000;
                        break;
                }
            },
            GetDuration: function () {
                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        try {
                            return webapis.avplay.getDuration();
                        } catch (e) {

                        }
                        break;
                    case "DST_LG":
                        return parseInt(video.duration * 1000);
                        break;
                }
            },
            SeekTo: function (ms) {
                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        try {
                            webapis.avplay.seekTo(ms);
                        } catch (e) {

                        }
                        break;
                    case "DST_LG":
                        video.currentTime = ms / 1000;
                        break;
                }
            },
            GetCurrentPlayTime: function () {
                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        return currentPlayTime;
                    case "DST_LG":
                        return video.currentTime;
                }
            },
            GetCurrentState: function () {
                switch (DeviceService.sub_type()) {
                    case "DST_SAMSUNG":
                        try {
                            return webapis.avplay.getState();
                        } catch (e) {

                        }
                        break;
                    case "DST_LG":
                        return video.paused ? "PAUSED" : "PLAYING";
                }
            },
            Suspend: function () {
                try {
                    webapis.avplay.suspend();
                } catch (e) {

                }
            },
            Restore: function () {
                try {
                    webapis.avplay.restore();
                } catch (e) {

                }
            }
        }
    });
})();
