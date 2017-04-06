'use strict';

angular.module('user').factory('UserAccountService', function($http, authToken,$window) {
    var userSignup = 'api/users',
        userSignin = 'api/signin',
        getUser = 'api/me',
        dataFactory = {};

    //User Signup Service call
    dataFactory.userSignup = function(formData) {        
        return $http.post(userSignup, formData);
    }
    //User Sigin service call
    dataFactory.userSignin = function(formData) {        
        return $http.post(userSignin, formData);
    };
    
    //UserAccountService.isuserSignin
    dataFactory.isuserSignin = function(){
        if(authToken.getToken()) {
            return true;
        }
        else {
            return false;
        }
    };
    //UserAccountService.getUser
    dataFactory.getUser = function() {
        if(authToken.getToken()) {
            return $http.post(getUser);
        } else {
            $q.reject( { message: "user has no token"});
        }
    };

    //UserAccountService.userSignout
    dataFactory.userSignOut = function() {
        // return $http.post(userSignOut);
        authToken.setToken();
    }
    return dataFactory;
})
.factory('authToken', function($window){
    var authTokenFactory = {};
    //authToken.setToken(token)
    authTokenFactory.setToken = function(token) {
        if(token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
       
    };
    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };
    return authTokenFactory;
}).factory('AuthInterceptors', function(authToken){
    var authInterceptorsFactory = {};
    authInterceptorsFactory.request = function(config){
        var token = authToken.getToken();
        if(token)  config.headers['x-access-token'] = token;
        return config;
    }
    return authInterceptorsFactory;
});
