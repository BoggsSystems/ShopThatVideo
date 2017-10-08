'use strict';

angular.module('cmsShoppableApp')

.factory('projectDetailService', function($http) {
	var getProject = function(projectId, populateDetails) {
		return $http.get('/api/projects/' + projectId + '/' + populateDetails);
	};
	var updateProject = function(project) {
		return $http.put('/api/projects/' + project._id, project);
	};
	var addProduct = function(product) {
		return $http.post('/api/products', product);
	};
	var updateProduct = function(product) {
		return $http.put('/api/products/' + product._id, product);
	};
	var deleteProduct = function(product) {
		return $http.delete('/api/products/' + product._id);
	};
	var addProductGroup = function(productGroup) {
		return $http.post('/api/productGroups', productGroup);
	};
	var updateProductGroup = function(productGroup) {
		return $http.put('/api/productGroups/' + productGroup._id, productGroup);
	};
	var deleteProductGroup = function(productGroup) {
		return $http.delete('/api/productGroups/' + productGroup._id);
	};
	return {
		getProject 			: getProject,
		updateProject 		: updateProject,
		addProduct 			: addProduct,
		updateProduct 		: updateProduct,
		deleteProduct 		: deleteProduct,
		addProductGroup 	: addProductGroup,
		updateProductGroup 	: updateProductGroup,
		deleteProductGroup 	: deleteProductGroup
	}
})