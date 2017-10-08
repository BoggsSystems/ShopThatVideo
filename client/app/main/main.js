'use strict';

angular.module('cmsShoppableApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: false,
        bodyClass: 'main'
      });
  });