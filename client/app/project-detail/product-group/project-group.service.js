'use strict';

angular.module('cmsShoppableApp')

.factory('productGroupService', function($http) {
	var updateProductGroup = function(productGroup) {
		return $http.put('/api/productGroups/' + productGroup._id, productGroup);
	};
	return {
		updateProductGroup		: updateProductGroup
	}
})