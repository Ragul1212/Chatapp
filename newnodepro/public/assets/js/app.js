var app = angular.module('myApp',['ui.router','ngMessages','btford.socket-io', 'myAppRouter','user', 'chatApp'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});