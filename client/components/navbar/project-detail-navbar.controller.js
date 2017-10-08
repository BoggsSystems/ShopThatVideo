'use strict';

angular.module('cmsShoppableApp')
  .controller('ProjectDetailNavbarCtrl', function ($scope, $location, $window, Auth) {
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.goback = function() {
      $window.history.back();
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });