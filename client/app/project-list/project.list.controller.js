'use strict';

angular.module('cmsShoppableApp')
  .controller('ProjectListCtrl', function ($scope, $q, $http, $sce, $uibModal, $state, $timeout, Project, projectService, playVideoService) {
	// console.log('ProjectListCtrl');
	var addProductGroupModalInstance = null;

	$scope.addProject = function() {
		addProductGroupModalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'app/project-list/add-project.html',
			scope: $scope,
			backdrop: 'static',
			windowClass: 'add-project-modal'
		});

		addProductGroupModalInstance.result.then(function (project) {
		  // console.log('project: ', project);
		}, function () {
		  $log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.save = function(valid, project) {
		if(!valid) {
			return false;
		}
		projectService.addProject(project)
		.success(function(project){
			$scope.projectList.push(project);
		})
		.error(function(err){
			console.log('err adding project');
		});
		addProductGroupModalInstance.close(project);
	};

	$scope.cancel = function(project) {
		addProductGroupModalInstance.close();
	};

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	};

	$scope.openVideoModal = function(project) {
		playVideoService.openVideoModal(project);
	};

	$scope.openProductGroups =  function( project, idx, visibility ){

		// reset $index
		if ( visibility === 'hide'){
			$scope.currentProjectIndex = null;
		} else {
			if (project.productGroupTimeLine.length > 0){

				projectService.getPopulatedProject(project._id)
				.then(function(response) {
					// console.log('projectPopulated', response);
					$timeout(function() {
						$scope.currentProductGroups = response.data.productGroupTimeLine;
						$scope.currentProjectIndex = idx;
					});
				}, function(err) {
					console.log(err);
				});
			} else {
				$scope.currentProjectIndex = idx;
				$scope.currentProductGroups = [];
			}
		}
	};

	$scope.deleteItem = function(type, item, index) {
		var newScope = $scope.$new();
		newScope.item = item;
		newScope.type = type;

		var deleteItemModalInstance = $uibModal.open({
			animation: true,
			template: '<div class="modal-dark"><div class="modal-header">'+
			'<h4 class="modal-title"> Delete {{ type }}: {{ item.name }}?</h4>'+
			'</div>'+
			'<div class="modal-footer">'+
			'<p ng-show="error">Error deleting {{ type }}</p>'+
			'<button class="btn btn-danger" type="button" ng-click="ok()">Delete</button>'+
			'<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>'+
			'</div></div>',
			scope: newScope
		});
		newScope.ok = function() {
			// console.log('delete item', item);
			if(type === 'project') {
				projectDetailService.deleteProduct(item)
				.success(function() {
					deleteItemModalInstance.close({ type: type, index: index });
				})
				.error(function(err){
					newScope.error = err;
				});
			} else {
				projectDetailService.deleteProductGroup(item)
				.success(function() {
					deleteItemModalInstance.close({ type: type, index: index });
				})
				.error(function(err){
					newScope.error = err;
				});
			}
		};
		newScope.cancel = function() {
			deleteItemModalInstance.dismiss('cancel');
		};
		deleteItemModalInstance.result.then(function (result) {
			if(result.type === 'product') {
				$scope.selectedProductGroup.products.splice(result.index, 1);
			} else {
				$scope.project.productGroupTimeLine.splice(result.index, 1);
			}
			//console.log('delete');
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.editProduct = function(project, productGroup, product) {
		$state.go('project-detail', { projectId: project._id, productGroupId: productGroup._id, productId: product._id });
	};

	$scope.openIframeInfo = function(project) {
		$uibModal.open({
			animation: false,
			template: `<pre style="white-space: normal;">&lt;iframe src="http://video.shopthatvideo.com/#/ad/${project._id}" style="position: absolute;height: 350px;width: 570px">Your browser does not support iframes.&lt;/iframe>`
		});
	};

	$scope.loadingProjects = true;
	projectService.getMyProjects().then(function (response) {
		$scope.loadingProjects = false;
		$scope.projectList = response.data;
	});

	// projectService.getProjects()
	// .success(function(projectList){
	// 	$scope.projectList = projectList;
	// })
	// .error(function(err){
	// 	console.log('err fetching project list');
	// })

  });
