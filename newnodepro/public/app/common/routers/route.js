var app = angular.module('myAppRouter',['ui.router','user']).config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        
        // LOGIN VIEWS ========================================
        .state('login', {
            url: '/login',
            templateUrl: 'app/login/views/login.html',
            controller: 'UserAccountController',
            authenticated: true
        })
        
        // REGISTER VIEWS =================================
        .state('register', {
            url: '/register',
            templateUrl: 'app/register/views/signup.html',
            controller: 'UserAccountController' ,
            authenticated: true     
        })
        .state('mainpage', {
            url: '/mainpage',
            templateUrl: 'app/views/mainpage.html',
            controller: 'chatCtrl',
            authenticated: false   
        });
        
});

app.run(['$rootScope', 'UserAccountService', function($rootScope, UserAccountService ){
    $rootScope.$on('$stateChangeStart', function(event, next, current){
        if((next.authenticated == true)) {
            console.log('you  have permission');
            
        }
        else if((next.authenticated == false)) {
            if(UserAccountService.isuserSignin()){
                 console.log('you have permission');
            }
            else {
                alert('you dont have permission to access this' + " " + next.name + " Page please login" );
                event.preventDefault();
            }
        }
    });
}]);