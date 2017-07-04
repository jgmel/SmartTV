/**
 * Created by strobil on 11.04.17.
 */

app.directive('navBar', function ($state, $stateParams, $timeout, NgTimeManager, KeyCodeService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'templates/directives/ngNavbar.html',
        link: function ($scope, $el, $attrs) {

        },
        controller: function ($scope) {
            $scope.visible = true;

            $scope.trans = {
                "menu": "Главное меню",
                "channels.list": "Список каналов",
                "vod.genres": "Кинозал",
                "personal_cab": "Личный кабинет",
                'settings': 'Настройки',
                'exit': 'Выход',
                'vod.movie': 'Кинозал',
                'vod.movie.series': 'Выбор серии',
                'vod.playback': 'Кинозал'
            };
            $scope.state = $scope.trans[$state.$current.name];

            $scope.showBack = function () {
                return $state.$current.name !== 'menu';
            };

            $scope.goBack = function () {
                var newState;
                var params = {};

                switch ($state.$current.name) {
                    case "channels.playback":
                        newState = "channels.list";
                        break;
                    case "vod.movie":
                        newState = "vod.genres";
                        break;
                    case "vod.playback":
                        newState = "vod.movie";
                        params = $stateParams;
                        break;
                    case "vod.movie.series":
                        newState = "vod.movie";
                        params = $stateParams;
                        break;
                    case "vod.genres":
                    case "vod.genres.movies":
                    case "channels.list":
                    case "personal_cab":
                    case "exit":
                        newState = "menu";
                        break;
                    case "menu":
                        newState = "exit";
                        break;
                }

                if (newState) {
                    $state.go(newState, params);
                }
            };

            $scope.getTime = function () {
                var time = NgTimeManager.getTime();
                var m = moment(time);

                if (m.isValid()) {
                    return m.format('HH:mm').toString();
                }
                return "";
            };

            $scope.$watch($scope.getTime, function (result) {
                $scope.time = result;
            });

            $scope.onKeyDown = function (event) {
                switch (event.keyCode) {
                    case KeyCodeService.VK_Return:
                    case 8:
                        $scope.goBack();
                        break;
                    case KeyCodeService.VK_Exit:
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        $state.go('exit');
                        break;
                }
            };

            $scope.$on("navbar:show", function () {
                $timeout(function () { $scope.visible = true; })
            });

            $scope.$on("navbar:hide", function () {
                $timeout(function () { $scope.visible = false; })
            });

            $scope.$on("navbar:set_title", function (event, title) {
                $timeout(function () { $scope.title = title; })
            });

            $(document.body).bind('keydown.navbar', $scope.onKeyDown);

            $scope.$on('$destroy', function () {
                $(document.body).unbind('.navbar');
            });
        }
    }
});