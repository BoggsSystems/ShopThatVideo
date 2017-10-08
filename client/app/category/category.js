'use strict';

angular.module('cmsShoppableApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('category', {
        url: '/category',
        templateUrl: 'app/category/category.html',
        controller: 'CategoryCtrl',
        authenticate: true
      });
  });
