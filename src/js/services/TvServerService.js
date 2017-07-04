/**
 * Created by strobil on 11.01.17.
 */

app.service('TvServerService', function ($http, $q, Constants, $state, $stateParams, $cacheFactory, $interval, $rootScope, DeviceService, TizenSpecificEvents) {

    var Service = "TvServerService";
    var Data = $cacheFactory('TvServerData');

    var CodeAuthTransactionId = 0;
    var CodeAuthTransactionType = "";

    var MakeRequest = function (Method, Data) {
        return $http(
            {
                url: Constants.TvServerUrl + Service + '/' + Method + '.json',
                data: Data,
                method: "POST"
            }
        );
    };

    $interval(function () {
        Data.remove('channels');
    }, 180000);

    var onAuthError = function () {
        $state.go('auth');
    };

    return {
        Data: Data,
        Auth: function () {
            var auth;

            if (auth = Data.get('Auth')) {
                return $q.resolve(auth);
            }

            var request = {
                device: DeviceService.device()
            };

            return MakeRequest('Auth', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(Data.put('Auth', response.data.auth_token));
                        case "WrongUser":
                            return $q.reject("Can't auth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetTime: function () {
            var request = {
                auth: Data.get('Auth')
            };

            return MakeRequest('GetTime', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.time);
                        case "NoAuth":
                            onAuthError();
                            return $q.reject("Can't auth");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetChannels: function () {
            var channels;

            if (channels = Data.get('channels')) {
                return $q.resolve(channels);
            }

            var request = {
                auth: Data.get('Auth'),
                need_icons: true,
                need_epg: true,
                need_offsets: true,
                epg_limit_prev: 10,
                epg_limit_next: 10
            };

            return MakeRequest('GetChannels', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(Data.put('channels', response.data));
                        case "NoAuth":
                            onAuthError();
                            return $q.reject("NoAuth");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetUserInfo: function () {
            var request = {
                auth: Data.get('Auth')
            };

            return MakeRequest('GetUserInfo', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(Data.put('UserInfo', response.data.info));
                        case "NoAuth":
                            onAuthError();
                            return $q.reject("NoAuth");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        OpenStream: function (channelId) {
            var request = {
                auth: Data.get('Auth'),
                channel_id: parseInt(channelId),
                accept_scheme: ["HTTP_HLS", "HTTP_UDP"]
            };

            return MakeRequest('OpenStream', request)
                .then(function (response) {
                    switch (response.data.result) {
                        case "OK":
                            return $q.resolve(response.data);
                        case "NoAuth":
                            onAuthError();
                            return $q.reject("NoAuth");
                        case "NotFound":
                            return $q.reject(response.data.result);
                        case "Deny":
                            return $q.reject(response.data.result);
                    }
                }, function () {
                    return $q.reject(response.statusText);
                });
        },
        UpdateStream: function (streamId) {
            var request = {
                auth: Data.get('Auth'),
                stream_id: streamId
            };

            return MakeRequest('UpdateStream', request)
                .then(function (response) {
                    switch (response.data.result) {
                        case "OK":
                            return $q.resolve();
                        case "NoAuth":
                            onAuthError();
                            return $q.reject(response.data.result);
                        case "ReopenStream":
                            return $q.reject(response.data.result);
                        case "NotFound":
                            return $q.reject(response.data.result);
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        CloseStream: function (streamId) {
            var request = {
                auth: Data.get('Auth'),
                stream_id: streamId
            };

            return MakeRequest('CloseStream', request)
                .then(function (response) {
                    switch (response.data.result) {
                        case "OK":
                            return $q.resolve();
                        case "NoAuth":
                            onAuthError();
                            return $q.reject("Need re-auth");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        CodeAuthTransactionStart: function () {
            var request = {
                device: DeviceService.device()
            };

            return MakeRequest('CodeAuthTransactionStart', request)
                .then(function (response) {
                    CodeAuthTransactionId = response.data.transaction_id;
                    CodeAuthTransactionType = response.data.auth_type;
                    return $q.resolve(response.data);
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        CodeAuthTransactionUpdate: function () {
            var request = {
                transaction_id: CodeAuthTransactionId
            };

            return MakeRequest('CodeAuthTransactionUpdate', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            $q.resolve(response);
                            break;
                        case "TransactionIdInvalid":
                            this.codeAuthTransactionId = 0;
                            $q.reject(new Error("Transaction id is invalid"));
                            break;
                    }
                });
        },
        CodeAuthTransactionSetPhone: function (val) {
            var request = {
                transaction_id: CodeAuthTransactionId,
                phone: val
            };

            return MakeRequest('CodeAuthTransactionSetPhone', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            $q.resolve(response);
                            break;
                        case "PhoneInvalid":
                            $q.reject("Entered phone is invalid");
                            break;
                        case "TransactionIdInvalid":
                            this.codeAuthTransactionId = 0;
                            $q.reject("Transaction id is invalid");
                            break;
                        default:
                            $q.reject("Unknown error");
                    }
                })
        },
        CodeAuthTransactionSetCode: function (val) {
            var request = {
                transaction_id: CodeAuthTransactionId,
                auth_code: parseInt(val)
            };

            return MakeRequest('CodeAuthTransactionSetCode', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(Data.put('Auth', response.data.auth_token));
                        case "CodeInvalid:":
                            return $q.reject("Entered auth code is invalid");
                        case "TransactionIdInvalid":
                            CodeAuthTransactionId = 0;
                            return $q.reject("Transaction id is invalid");
                    }
                });
        }
    };
});