/**
 * Created by strobil on 17.01.17.
 */

(function () {
    app.service('DeviceService', function () {
        var device = {
            type: "DT_SmartTV",
            sub_type: getDeviceSubType()
        };

        var displayInfo = {
            resolutionX: 0,
            resolutionY: 0
        };

        var ready = false;

        function getDeviceSubType() {
            try {
                if (typeof window.tizen === "object") {
                    return "DST_SAMSUNG";
                }
                if (typeof window.gSTB === "object") {
                    return "DST_INFOMIR";
                }
                if (typeof window.sekator_stb === "object") {
                    return "DST_INEXT";
                }
                if (typeof window.webos === "object") {
                    return "DST_LG";
                }
                return "DST_BROWSER";
            }
            catch (e) {
                return false;
            }
        }

        function init() {
            getDeviceSubType();

            switch (device.sub_type) {
                case "DST_LG":
                    try {
                        // device.screen_info = {};
                        //
                        // var deviceInfo = PalmSystem.deviceInfo;
                        //
                        //
                        // device.screen_info.width = deviceInfo.screenWidth;
                        // device.screen_info.height = deviceInfo.screenHeight;


                        webOS.service.request("luna://com.webos.service.sm",
                            {
                                method: "deviceid/getIDs",
                                parameters: {
                                    "idType": ["LGUDID"]
                                },
                                onSuccess: function (result) {
                                    device.uuid = result.idList[0].idValue;

                                    ready = true;
                                }
                            }
                        );
                    } catch (e) {
                    }
                    break;
                case "DST_SAMSUNG":
                    try {
                        device.uuid = webapis.productinfo.getDuid();
                        device.mac = webapis.network.getMac();

                        tizen.systeminfo.getPropertyValue("DISPLAY", function (data) {
                            device.screen_info = {};

                            device.screen_info.width = data.resolutionWidth;
                            device.screen_info.height = data.resolutionHeight;

                            ready = true;
                        });
                    } catch (e) {
                    }
                    break;
                case "DST_BROWSER":
                    device.mac = "00:11:22:33:44:55";
                    ready = true;
                    break;

            }
        }

        init();

        return {
            device: function () {
                return device;
            },
            mac: function () {
                return device.mac;
            },
            uuid: function () {
                return device.uuid;
            },
            type: function () {
                return "DT_SmartTV";
            },
            sub_type: function () {
                return device.sub_type;
            },
            displayInfo: function () {
                return displayInfo;
            },
            ready: function () {
                return ready;
            }
        };
    });
})();


