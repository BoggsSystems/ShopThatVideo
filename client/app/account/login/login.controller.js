'use strict';

angular.module('cmsShoppableApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $uibModal) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/projects');
        })
        .catch( function(err) {
          if(err.code=="NOT_APPROVED") {
            $uibModal.open({
              templateUrl: 'app/account/login/loginModal.html'
            });
          }
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });