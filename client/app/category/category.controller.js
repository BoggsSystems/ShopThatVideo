'use strict';

angular.module('cmsShoppableApp')
  .controller('CategoryCtrl', function ($scope, $state, $http, Auth, Category, Modal) {
    $scope.showCategoryForm = true;
    $scope.category = new Category();
    Auth.isLoggedInAsync(function(isLoggedIn) {
      if(isLoggedIn) {
        if(!Auth.isAdmin()) {
          $state.go('main');
        } else {
          // Use the Category $resource to fetch all categories
          $scope.categories = Category.query();
        }
      } else {
        $state.go('login');
      }
    });

    $scope.submitForm = function(form) {
      if(!form.$valid) {
        return;
      }
      if($scope.category._id) {
        $scope.category.$update()
        .then(function(updatedCategory) {
          console.log('updatedCategory', updatedCategory);
          angular.forEach($scope.categories, function(category){
            if(category._id == updatedCategory._id) {
              category = angular.extend(category, updatedCategory);
            }
          });
          $scope.clear();
          form.$setPristine();
        })
        .catch(function(err) {
          console.log('err', err);
        });
      } else {
        $scope.category.$save()
        .then(function(createdCategory) {
          console.log('createdCategory', createdCategory);
          $scope.categories.push(createdCategory);
          $scope.clear();
          form.$setPristine();
        })
        .catch(function(err) {
          console.log('err', err);
        });
      }
    };

    $scope.edit = function(category) {
      $scope.category = new Category(category);
    };

    $scope.clear = function() {
      $scope.category = new Category();
    };

    $scope.delete = Modal.confirm.deleteModal(function(category) {
      Category.remove({ id: category._id }).$promise
      .then(function() {
        _.remove($scope.categories, { _id: category._id});
      }, function(err){
        console.log('err', err);
        $scope.deleteError = err;
      });
    });
  });