angular.module('user').factory('Socket', ['socketFactory', function(socketFactory){
    return socketFactory();
}]);