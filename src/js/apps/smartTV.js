/**
 * Created by strobil on 18.11.16.
 */

"use strict";

var app = angular.module('app', ['ui.router','ngResource','angularUtils.directives.dirPagination']);

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $resourceProvider) {
    $stateProvider
        .state("auth", {
            url: "/auth",
            templateUrl: "templates/auth/auth.html",
            controller: "AuthController"
        })
        .state("signup", {
            url: "/signup",
            template: "<ui-view></ui-view>",
            controller: "SignUpController"
        })
        .state("signup.with_phone", {
            url: "/with_phone",
            templateUrl: "templates/signup/with_phone.html"
        })
        .state("signup.with_code", {
            url: "/with_code",
            templateUrl: "templates/signup/with_code.html"
        })
        .state("signup.verify_code", {
            url: "/verify_code",
            templateUrl: "templates/signup/enter_code.html"
        })
        .state("menu", {
            url: "/menu",
            templateUrl: "templates/menu/menu.html",
            controller: "MenuController"
        })
        .state("channels", {
            abstract: true,
            name: "channels",
            url: "/channels",
            template: "<ui-view></ui-view>"
        })
        .state("channels.list", {
            url: "/list",
            templateUrl: "templates/channels/list.html",
            controller: "ChannelListController"
        })
        .state("channels.playback", {
            url: "/playback/:channelId",
            templateUrl: "templates/channels/playback.html",
            controller: "ChannelPlaybackController"
        })
        .state("vod", {
            abstract: true,
            name: "vod",
            url: "/vod",
            template: "<ui-view></ui-view>"
        })
        .state("vod.genres", {
            url:  "/genres",
            templateUrl: "templates/vod/genres.html",
            controller: "VodGenresController"
        })
        .state("vod.genres.movies", {
            url:  "/:genreId/movies",
            templateUrl: "templates/vod/movies.html",
            controller: "VodGenresMoviesController"
        })
        .state("vod.movie", {
            url:  "/movie/:movieId",
            templateUrl: "templates/vod/movie.html",
            controller: "VodMovieController"
        })
        .state("vod.movie.series", {
            url: "/series",
            templateUrl: "templates/vod/movie_series.html",
            controller: "VodMovieSeriesController"
        })
        .state("vod.playback", {
            url: "/playback/:movieId",
            templateUrl: "templates/vod/playback.html",
            controller: "VodPlaybackController"
        })

        .state("personal_cab", {
            url: "/personal_cab",
            templateUrl: "templates/personal_cab/cab.html",
            controller: "PersonalCabController"
        })
        .state("network_disconnected", {
            url: "/network_disconnected",
            templateUrl: "templates/network/network_disconnected.html",
            controller: "NetworkDisconnectedController"
        })
		
		.state('ovva', {
            url: '/ovva',
            templateUrl: 'templates/ovva/ovva.html',
            controller: 'OvvaCatController'            
        })
		
		.state('ovva.item', {
        url: '/:title',
		templateUrl: 'templates/ovva/iframe-list.html',
        controller: 'OvvaCatController'  
        })
		
		
        .state("exit", {
            url: "/exit",
            templateUrl: "templates/exit/exit.html",
            controller: "ExitController"
        });

    $urlRouterProvider.otherwise("/auth");

    $httpProvider.defaults.headers.post['Content-Type']='application/json';
});

app.run(function () {
    $$nav.on();
});