'use strict';

angular.module('cmsShoppableApp')
  .factory('Category', function ($resource) {
    return $resource('/api/categories/:id/:controller', {
      id: '@_id'
    },
    {
      update: {
        method: 'PUT'
      }
	  });
  });
