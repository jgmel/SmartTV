/**
 * Created by strobil on 24.02.17.
 */

app.service('MediaServerService', function ($http, $q, $cacheFactory, $state, TvServerService, Constants) {
    var Service = 'MediaServerService';

    var Data = $cacheFactory('MediaServerData');

    var GenreMovies = $cacheFactory('GenreMovies');
    var MovieInfo = $cacheFactory('MovieInfo');


    var MakeRequest = function (Method, Data) {
        return $http.post(Constants.TvServerUrl + Service + '/' + Method + '.json', Data);
    };

    return {
        Data: Data,
        GetGenres: function () {
            var request = {
                auth: TvServerService.Data.get('Auth')
            };

            var genres;

            if (genres = Data.get('genres')) {
                return $q.resolve(genres);
            }

            return MakeRequest('GetGenres', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(Data.put('genres', response.data.genres));
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetGenreMovies: function (_genre_id, _sort_mode) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                genre_id: _genre_id,
                sort_mode: _sort_mode
            };

            var genre_movies;
            var cache_key = _genre_id+_sort_mode;

            if (genre_movies = GenreMovies.get(cache_key)) {
                return $q.resolve(genre_movies);
            }

            return MakeRequest('GetGenreMovies', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(GenreMovies.put(cache_key, response.data.movies));
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        SearchMovies: function (_search_name, _sort_mode) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                search_name: _search_name,
                sort_mode: _sort_mode
            };

            return MakeRequest('SearchMovies', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.movies);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetMovieInfo: function (_movies) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                movies: _movies
            };

            var found_all = true;
            var result = [];

            angular.forEach(_movies, function (value, key) {
                var info;

                if (info = MovieInfo.get(value)) {
                    result.push(info);
                } else {
                    found_all = false;
                    return false;
                }
            });

            if (found_all) {
                return $q.resolve(result);
            }

            return MakeRequest('GetMovieInfo', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            if (angular.isArray(response.data.movies)) {

                                var result = [];

                                angular.forEach(response.data.movies, function (value, key) {
                                    MovieInfo.put(value.id, value);
                                    result.push(value);
                                });

                                return $q.resolve(result);
                            }
                            break;
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetMoviePoster: function (_movie_id) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                movie_id: parseInt(_movie_id),
                size: "Poster"
            };

            return MakeRequest('GetMoviePoster', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.poster);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetMovieLink: function (_movie_id, _release_id, _link_id) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                movie_id: parseInt(_movie_id),
                release_id: parseInt(_release_id),
                link_id: parseInt(_link_id)
            };

            return MakeRequest('GetMovieLink', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.url);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        case "NotFound":
                            return $q.reject("NotFound");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetFavoriteMovie: function () {
            var request = {
                auth: TvServerService.Data.get('Auth')
            };

            return MakeRequest('GetMovieLink', request)
                .then(function (response) {
                    switch (response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.movies);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        SetFavoriteMovie: function (_movies) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                movies: _movies
            };

            return MakeRequest('SetFavoriteMovie', request)
                .then(function (response) {
                    switch(response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.status);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        UpdateFavoriteMovie: function (_to_add, _to_delete) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                to_add: _to_add,
                to_delete: _to_delete
            };

            return MakeRequest('UpdateFavoriteMovie', request)
                .then(function (response) {
                    switch(response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.status);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetMovieWatchInfo: function (_movie_id, _release_id, _link_id) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                movie_id: _movie_id,
                release_id: _release_id,
                link_id: _link_id
            };

            return MakeRequest('GetMovieWatchInfo', request)
                .then(function (response) {
                    switch(response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.status);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        case "NotFound":
                            return $q.reject("NotFound");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        UpdateMovieWatchInfo: function (_info) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                info: _info
            };

            return MakeRequest('UpdateMovieWatchInfo', request)
                .then(function (response) {
                    switch(response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.status);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetLastWatchList: function (_count_limit) {
            var request = {
                auth: TvServerService.Data.get('Auth'),
                count_limit: _count_limit
            };

            return MakeRequest('GetLastWatchList', request)
                .then(function (response) {
                    switch(response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.status);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetPersons: function () {
            var request = {
                auth: TvServerService.Data.get('Auth')
            };

            return MakeRequest('GetPersons', request)
                .then(function (response) {
                    switch(response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.persons);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        },
        GetCountries: function () {
            var request = {
                auth: TvServerService.Data.get('Auth')
            };

            return MakeRequest('GetCountries', request)
                .then(function (response) {
                    switch(response.data.status) {
                        case "OK":
                            return $q.resolve(response.data.countries);
                        case "NoAuth":
                            return $q.reject("NoAuth");
                        default:
                            return $q.reject("Unknown error");
                    }
                }, function (response) {
                    return $q.reject(response.statusText);
                });
        }
    }
});