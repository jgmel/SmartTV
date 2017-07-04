app.controller('SignUpController', function ($scope, $state, $interval, TvServerService) {

    $scope.retryAuth = function () {
        TvServerService.Auth()
            .then(function () {
                $state.go('menu');
            });
    };

    $scope.updateTransaction = function () {
        TvServerService.CodeAuthTransactionUpdate();
    };

    TvServerService.CodeAuthTransactionStart()
        .then(function (response) {
            $scope.transactionUpdateTimer = $interval($scope.updateTransaction, 60*1000, 0, false);

            switch(response.auth_type) {
                case "Code":
                    $scope.auth_code = response.auth_code;
                    $scope.authUpdateTimer = $interval($scope.retryAuth, 5*1000, 0, false);
                    $state.go("signup.with_code");
                    break;
                case "SMS":
                    $state.go("signup.with_phone");
                    break;
            }
        });

    $scope.setPhone = function (val) {
        var op_codes = [50, 63, 66, 67, 68, 73, 93, 95, 96, 97, 98, 99];
        var pattern = new RegExp('^0'+'('+op_codes.join('|')+')'+'\\d{7}$');

        if (pattern.test(val)) {
            TvServerService.CodeAuthTransactionSetPhone(val)
                .then(function () {
                    $state.go("signup.verify_code");
                });
        } else {
            //todo display error msg to user
            $scope.errMsg = 'Неправильный формат номера телефона!';
        }
    };

    $scope.setCode = function (val) {
        var pattern = new RegExp('^\\d{4}$');
        if (pattern.test(val)) {
            TvServerService.CodeAuthTransactionSetCode(val)
                .then(function () {
                    $state.go("menu");
                });
        } else {
            //todo display error msg to user
            $scope.errMsg = 'Неправильный код верификации!';
        }
    };

    $scope.$on('$destroy', function() {
        $interval.cancel($scope.transactionUpdateTimer);

        if ($scope.authUpdateTimer) {
            $interval.cancel($scope.authUpdateTimer);
        }
    });

    $scope.$on('$viewContentLoaded', function () {
        $$nav.on($('.container:last'), $('.button')[0]);
    });
});