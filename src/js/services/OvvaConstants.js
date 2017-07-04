/* Factory */
app.factory('OvvaCat', [
  '$resource', function($resource) {
    return $resource('https://api.ovva.tv/v2/ru/category');}
  
]);

/* Factory */
app.factory('OvvaFrame', [
  '$resource', function($resource) {
    return $resource('https://api.ovva.tv/v2/ru/playlist');}
  
]);