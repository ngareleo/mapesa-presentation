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
    $scope.showFlash = true
    $scope.errorMessage =
      'Oh dear! This username and password pair seems to be incorrect.'
    const URL = '/login?type=app'
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

    $scope.closeFlash = () => {
      $scope.showFlash = true
    }
  },
])
