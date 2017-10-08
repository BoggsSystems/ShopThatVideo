'use strict';

angular.module('cmsShoppableApp')

.factory('projectService', function($http) {
	var addProject = function(project) {
		return $http.post('/api/projects', project);
	};
	
	var getProjects = function() {
		return $http.get('/api/projects');
	};

	var getMyProjects = function() {
		return $http.get('/api/projects/myprojects');
	};

	var getPublishedProjects = function() {
		return $http.get('/api/projects?activeOnly=true');
	};

	var getPopulatedProject = function(projectId) {
		return $http.get('/api/projects/'+projectId+'/true');
	};

	return {
		addProject			: addProject,
		getProjects 		: getProjects,
		getPublishedProjects: getPublishedProjects,
		getPopulatedProject	: getPopulatedProject,
		getMyProjects 		: getMyProjects
	}
})


.factory('Project', function($http, $q) {

	var apiRoot = '/api/';

	var Project = {

		/**
		 * Gets all available projects
		 *   (synchronous|asynchronous)
		 *
		 * @param  {Function|*} callback - optional, funciton(user)
		 * @return {Object|Promise}
		 */
		getProjects() {
			var deferred = $q.defer();

			var requestUrl = apiRoot + 'projects';

			$http.get(requestUrl, {cache:true})
				.then(function successCallback(response) {
					deferred.resolve(response.data);
				}, function errorCallback(err) {
					deferred.reject(err);
				});

			return deferred.promise;

		},

		getProductGroupsById( id ) {

			var requestUrl = apiRoot + 'productgroups/' + id;
			
			var deferred = $q.defer();

			$http.get(requestUrl, {cache:true})
				.then(function successCallback(response) {
					deferred.resolve(response.data);
				}, function errorCallback(err) {
					deferred.reject(err);
				});

			return deferred.promise;

		},

		getProductsById( id ) {

			var requestUrl = apiRoot + 'products/' + id;

			var deferred = $q.defer();

			$http.get(requestUrl)
				.then(function successCallback(response) {
					deferred.resolve(response.data);
				}, function errorCallback(err) {
					deferred.reject(err);
				});

			return deferred.promise;

		},

		deleteProjectById( id ) {

			var requestUrl = apiRoot + 'projects/' + id;
			
			var deferred = $q.defer();

			$http.delete( requestUrl )
				.then(function successCallback(response) {
					deferred.resolve(response.data);
				}, function errorCallback(err) {
					deferred.reject(err);
				});

			return deferred.promise;

		}
	};

	return Project;
})