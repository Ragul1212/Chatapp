angular.module('user', []).controller('UserAccountController', ['$rootScope', '$scope', '$state', '$http', '$location', '$window', '$timeout', 'UserAccountService', 'authToken', 'Socket', 
    function ($rootScope, $scope, $state, $http, $location, $window, $timeout, UserAccountService, authToken, Socket) {
        var app= this;
        $rootScope.showLoader = true;
        $rootScope.userID = '';
        $rootScope.$on('$stateChangeStart', function(){
            if(UserAccountService.isuserSignin()){
            console.log('user is log in');
            UserAccountService.getUser().then(function(response){
                console.log(response);
                console.log(response.data.username);
                $rootScope.userID = response.data.username;
            });
            }
            else {
                console.log('user is not log in');
                 $rootScope.userID = '';
            }
        });

        //REGISTER
        $scope.register = function (isvalid) {
            if (isvalid) {
                if ($scope.user.password == $scope.user.confirmPassword) {
                    var fdata = {
                        "username": $scope.user.username,
                        "password": $scope.user.password,
                        "email": $scope.user.username
                    };
                    UserAccountService.userSignup(fdata).then(function (response) {
                        console.log(response);
                        $scope.currentMessage = response.data.message;
                        $scope.currentStatus = response.data.txStatus;
                        $rootScope.showLoader = false;
                        $scope.userName = response.data.username;
                        if (response.data.txStatus == 'success') {
                            $timeout(function () {
                                $scope.login(true);
                            }, 2000);
                        }
                    },
                        function (response) {
                            $scope.cuurentMessage = "Something went wrong";
                        });
                }

            }
        };

        //SIGNIN
        $scope.login = function (isvalid) {
            if (isvalid) {
                var fdata = {
                    "username": $scope.user.username,
                    "password": $scope.user.password
                };
                UserAccountService.userSignin(fdata).then(function (response, status, header) {
                    authToken.setToken(response.data.token);
                    console.log(JSON.stringify(response) + JSON.stringify(status) + JSON.stringify(header));
                    $scope.currentMessage = response.data.message;
                    $scope.currentStatus = response.data.txStatus;
                    if (response.data.txStatus == 'success') {1
                         authToken.getToken();
                        $timeout(function () {
                            $state.go('mainpage');
                            Socket.connect();
                        }, 2000);
                    }
                    return response;
                },
                    function (response) {
                        $scope.cuurentMessage = "Something went wrong";
                    });
            }
        };
        
    }
]);