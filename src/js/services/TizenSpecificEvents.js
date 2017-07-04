/**
 * Created by strobil on 19.05.17.
 */

(function () {
    var TizenSpecificEvents = function (PlayerService, $state, $stateParams) {
        var
            lastState = "",
            lastStateParams = {};

        function saveCurrentState() {
            lastState = $state.$current.name;
            angular.copy($stateParams, lastStateParams);
        }

        function onVisibilityChange() {
            if (document.hidden) {
                PlayerService.Suspend();
            } else {
                PlayerService.Restore();
            }
        }

        function onNetworkStateChange(state) {
            var states = [
                "",
                "LAN_CABLE_ATTACHED",
                "LAN_CABLE_DETACHED",
                "LAN_CABLE_STATE_UNKNOWN",
                "GATEWAY_CONNECTED",
                "GATEWAY_DISCONNECTED",
                "WIFI_MODULE_STATE_ATTACHED",
                "WIFI_MODULE_STATE_DETACHED",
                "WIFI_MODULE_STATE_UNKNOWN"
            ];

            if (states[state] === "LAN_CABLE_DETACHED" || states[state] === "GATEWAY_DISCONNECTED") {
                saveCurrentState();
                $state.go("network_disconnected");
            } else if (states[state] === "LAN_CABLE_ATTACHED" || states[state] === "GATEWAY_CONNECTED") {
                if (lastState && lastStateParams) {
                    Log.push('returning to ', lastState);
                    Log.push('params', lastStateParams);
                    $state.go(lastState, lastStateParams);
                }
            }
        }

        function init() {
            document.addEventListener('visibilitychange', onVisibilityChange);

            try {
                webapis.network.addNetworkStateChangeListener(onNetworkStateChange);
            } catch (e) {
            }
        }

        init();
    };

    app.service('TizenSpecificEvents', function (PlayerService, $state, $stateParams) {
        return new TizenSpecificEvents(PlayerService, $state, $stateParams);
    });
})();