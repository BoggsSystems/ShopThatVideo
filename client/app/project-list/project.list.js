'use strict';

angular.module('cmsShoppableApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('projects', {
        url: '/projects',
        templateUrl: 'app/project-list/project-list.html',
        controller: 'ProjectListCtrl',
        authenticate: true
      });
  });