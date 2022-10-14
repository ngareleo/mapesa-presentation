const app = angular.module('LoginModule', [])
app.factory('LoginManager', [
  '$http',
  '$window',
  ($http, $window) => {
    return {
      logUser: (uName, passwd) => {},
    }
  },
])
app.controller('LoginCtrl', [
  '$scope',
  '$http',
  '$window',
  'LoginManager',
  ($scope, $http, $window, LoginManager) => {    
    const URL = '/signup'
    $scope.submitForm = () => {
        $http
          .post(URL, {
            username: $scope.userUsername,
            password: $scope.userPassword,
          })
          .then((response) => {
            if (response.data.authenticate === 1) {
              $window.location = '/'
            } else {
              //we throw a flash message
              console.log('Auth error')
              $scope.showFlash = false
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
  },
])
