'use strict';

angular.module('cmsShoppableApp')
  .controller('AdminCtrl', function ($scope, $state, $http, Auth, User, Modal) {

    Auth.isLoggedInAsync(function(isLoggedIn) {
      if(isLoggedIn) {
        if(!Auth.isAdmin()) {
          $state.go('main');
        } else {
          // Use the User $resource to fetch all users
          $scope.users = User.query();
        }
      } else {
        $state.go('login');
      }
    });

    $scope.delete = Modal.confirm.deleteModal(function(user) {
      User.remove({ id: user._id }).$promise
      .then(function(updatedUser) {
        // console.log('updatedUser', updatedUser);
        user.active = false;
      }, function(err){
        console.log('err', err);
        $scope.deleteError = err;
      });
    });

    $scope.activate = Modal.confirm.activateModal(function(user) {
      user.$activate({ id: user._id })
      .then(function(updatedUser) {
        // console.log('updatedUser', updatedUser);
        user.active = true;
      }, function(err){
        console.log('err', err);
        $scope.activateError = err;
      });
    });
  });
