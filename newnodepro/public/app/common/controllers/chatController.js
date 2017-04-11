angular.module('chatApp', []).controller('chatCtrl', ['$rootScope', '$scope', '$state', '$http', '$location', '$window', '$timeout', 'UserAccountService', 'authToken', 'Socket',
    function ($rootScope, $scope, $state, $http, $location, $window, $timeout, UserAccountService, authToken, Socket) {
        $scope.users= [];
        $scope.messages=[];
        $scope.imageFiles=[];
        $scope.chatMessages=[];
        $scope.chatusername=[];
        var chatMessages = function() {
             $http.get('api/chatmessage').then(function(response) { 
                    response.data.forEach(function(item){
                        console.log(item);
                        $scope.chatMessages.push({ username: item.chatusername, message: item.msg});
                    });
                });
                return $scope.chatMessages;
        }  
        console.log($rootScope.userID);
        console.log(chatMessages());
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            if(UserAccountService.isuserSignin()){
                console.log('user is log in');
                console.log($scope.chatMessages);
                UserAccountService.getUser().then(function(response){
                    console.log(response);
                    console.log(response.data.username);
                    $rootScope.userID = response.data.username;
                    if(toState.name == 'mainpage') {
                        console.log ('you are in mainpage');
                        chatMessages();
                        console.log($scope.chatMessages);
                    }
                });
            }
            else {
                console.log('user is not log in');
                 $rootScope.userID = '';
            }
        });


        // web socket
        var promptUsername = function(message) {
            Socket.emit('add-user', {username: $rootScope.userID});
        }
        $scope.sendMessage = function(msg) {
            if(msg != null && msg != '') {
                Socket.emit('message', {message: msg});
            }
            $scope.msg = '';
        }
        promptUsername('What is your name?');
        Socket.emit('request-users', {});
        Socket.on('users', function(data){
            $scope.users = data.users;
        });
        Socket.on('message', function(data){
            $scope.messages.push(data);
        });
        Socket.on('add-user', function(data){
            $scope.users.push(data.username);
            $scope.messages.push({ username: data.username, message: 'has entered the channel'});
        });
        Socket.on('remove-user', function(data){
            $scope.users.splice($scope.users.indexOf(data.username), 1);
            $scope.messages.push({ username: data.username, message: 'has left the channel'});
        });
        Socket.on('prompt-username', function(data){
            promptUsername(data.message);
        });

        //SIGNOUT
        $scope.signOut = function () {
            alert('Hi');
            UserAccountService.userSignOut();
            Socket.disconnect(true);
             $timeout(function () {
                $state.go('login');
            }, 2000);
        };

        // Chat image upload
        $scope.stepsModel = [];

        $scope.imageUpload = function(event){
            var files = event.target.files; //FileList object

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                    var reader = new FileReader();
                    reader.onload = $scope.imageIsLoaded; 
                    reader.readAsDataURL(file);
            }
        }

        $scope.imageIsLoaded = function(e){
            $scope.$apply(function() {
                $scope.stepsModel.push(e.target.result);
                console.log($scope.imageFiles);
                if($scope.stepsModel != null && $scope.stepsModel != '') {
                   Socket.emit('message', {imageFiles: $scope.stepsModel[$scope.stepsModel.length-1]});
                }
            });
        }
        $scope.removeMessage = function(index) {
            console.log(index);
            $scope.messages.splice(index, 1);
        }
    }
]);