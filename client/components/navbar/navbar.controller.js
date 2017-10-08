'use strict';

angular.module('cmsShoppableApp')
  .controller('NavbarCtrl', function ($scope, $location, $state, Auth) {
    // console.log('NavbarCtrl');
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    $scope.login = function() {
      $state.go('login');
    };

    $scope.signup = function() {
      $state.go('signup');
    };

    $scope.openProjects = function() {
      $state.go('projects');
    };

    $scope.gotoHome = function() {
      $state.go('main');
      // window.location.href = '/';
    };

    $scope.createProject = function() {

    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });