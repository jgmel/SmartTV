/**playing = true;
                return true;
        }
    }
 * Created by strobil on 25.04.17.
 */

(function () {
    var TimeManager = function (TvServerService) {
        var self = this;

        function updateTime() {
            TvServerService.GetTime()
                .then(function (response) {
                    self.time = response;
                });
        }

        window.setInterval(updateTime, 60000);

        function getTime() {
            return self.time * 1000;
        }

        updateTime();

        return {
            getTime: getTime
        }
    };

    app.service('NgTimeManager', function (TvServerService) {
        return new TimeManager(TvServerService);
    });
})();

