'use strict';

angular.module('cmsShoppableApp')
  .controller('ProjectDetailCtrl', function ($scope, $rootScope, $uibModal, $timeout, $log, $sce, $stateParams, Upload, Modal, 
  	projectDetailService, Auth, playVideoService, productGroupService, Category) {
	$scope.user = Auth.getCurrentUser();
	$scope.projectCategories = Category.query();
	$scope.selectProductGroup = function(productGroup) {
		$scope.selectedProductGroup = productGroup;
	};

	var refreshLayout = function() {
		$timeout(function() {
			initCustomForms();
		}, 500);
	};

	$scope.openAddProductGroupModal = function(editIndex) {
		var addProductGroupModalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: 'app/project-detail/product-group/add-product-group.html',
	      controller: 'AddProductGroupCtrl',
	      size: 'lg',
	      backdrop: 'static',
	      windowClass: 'add-product-group-modal',
	      resolve: {
	        productGroup: function () {
	        	// console.log(editIndex, $scope.project.productGroupTimeLine);
	          	return editIndex>=0?$scope.project.productGroupTimeLine[editIndex]:null;
	        },
	        project: function() {
	        	return $scope.project;
	        },
	        editIndex: function() {
	        	return editIndex;
	        }
	      }
	    });

	    addProductGroupModalInstance.result.then(function (result) {
	    	console.log('editIndex', result.editIndex);
	    	refreshLayout();
	    	if(result.editIndex>=0) {
	    		$scope.project.productGroupTimeLine[editIndex] = result.productGroup;
	    	} else {
	    		$scope.project.productGroupTimeLine.push(result.productGroup);
	    	}
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

	$scope.openAddProductModal = function(editIndex) {
		if(!($scope.selectedProductGroup && $scope.selectedProductGroup.products)) {
			window.alert('You dont have any product group.');
			return;
		}
		// console.log(editIndex);
		var addProductModalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: 'app/project-detail/product/add-product.html',
	      controller: 'AddProductCtrl',
	      size: 'lg',
	      backdrop: 'static',
	      windowClass: 'add-product-modal',
	      resolve: {
	        product: function () {
	        	// console.log(editIndex, $scope.selectedProductGroup.products[editIndex]);
				return editIndex>=0?$scope.selectedProductGroup.products[editIndex]:null;
	        },
	        productGroup: function () {
	          	return $scope.selectedProductGroup;
	        },
	        editIndex: function() {
	        	return editIndex;
	        }
	      }
	    });

	    addProductModalInstance.result.then(function (result) {
	    	// console.log('editIndex', result.editIndex);
	    	refreshLayout();
	    	if(result.editIndex>=0) {
	    		$scope.selectedProductGroup.products[editIndex] = result.product;
	    	} else {
	    		$scope.selectedProductGroup.products.push(result.product);
	    	}
	      
	    }, function () {
	      	$log.info('Modal dismissed at: ' + new Date());
	    });
	};
	
	$scope.deleteItem = function(type, item, index) {
		var newScope = $scope.$new();
		newScope.item = item;
		newScope.type = type;
		
		var deleteItemModalInstance = $uibModal.open({
			animation: true,
			template: '<div class="modal-dark"><div class="modal-header">'+
			  '<h4 class="modal-title"> Delete {{ type }}: {{ item.title || item.name }}?</h4>'+
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
			if(type === 'product') {
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
			refreshLayout();
			if(result.type === 'product') {
				$scope.selectedProductGroup.products.splice(result.index, 1);
			} else {
				$scope.project.productGroupTimeLine.splice(result.index, 1);
			}
			// console.log('delete');
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	};

	$scope.isFormValid = function() {
		// console.log('$scope.projectForm', $scope.projectForm);
		return $scope.projectForm;
	};

	$scope.updateProject = function() {
		$scope.projectForm.$submitted = true;
		$scope.projectUpdated = false;
		$rootScope.navbarStatusMessage = '';
		if(!$scope.projectForm.$valid) {
			return;
		}
		if(!$scope.project.media || !$scope.project.thumbnail) {
			return false;
		}
		$scope.project.populateDetails = true;
		$scope.disableButton = true;
		projectDetailService.updateProject($scope.project)
		.success(function(project){
		  // console.log('project updated', project);
		  $scope.project = project;
		  $scope.projectUpdated = true;
		  $rootScope.navbarStatusMessage = 'Project saved successfully';
		  $scope.disableButton = false;
		  refreshLayout();
		})
		.error(function(error){
		  $scope.error = error;
		  console.log('error while updating project..', error);
		  $scope.disableButton = false;
		  refreshLayout();
		});
	};

	$scope.updateProductGroup = function(productGroup) {
		productGroupService.updateProductGroup(productGroup).then(function(updatedProductGroup) {
			// console.log('updatedProductGroup', updatedProductGroup);
		}, function(err) {

		});
	};

	$scope.openVideoModal = function(project) {
		playVideoService.openVideoModal(project);
	};

	$scope.uploadFile = function(file, type){
	  $scope[type] = file;

	  if (!$scope[type]) return;
	  if (file && !file.$error) {
	    file.upload = Upload.upload({
	      url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
	      fields: {
	        upload_preset: $.cloudinary.config().upload_preset,
	        tags: 'project ' + type,
	        // context: 'photo=' + $scope.title
	      },
	      file: file
	    }).progress(function (e) {
	      if(type == 'video') {
	      	$scope.videoUploadProgress = Math.round((e.loaded * 100.0) / e.total);
	      	$scope.videoUploadStatus = "Uploading... " + $scope.videoUploadProgress + "%";
	      } else {
	      	$scope.imageUploadProgress = Math.round((e.loaded * 100.0) / e.total);
	      	$scope.imageUploadStatus = "Uploading... " + $scope.imageUploadProgress + "%";
	      }
	    }).success(function (data, status, headers, config) {
	      // data.context = {custom: {photo: $scope.title}};
	      	// console.log('data', data);
	      	$scope[type].result = data;
	     	$scope.project[type=='video'?'media':'thumbnail'] = {
	      	  bytes       : data.bytes,
	      	  created_at      : data.created_at,
	      	  // etag       : data.etag,
	      	  format        : data.format,
	      	  duration 		: data.duration,
	      	  height        : data.height,
	      	  original_filename : data.original_filename,
	      	  public_id     : data.public_id,
	      	  resource_type     : data.resource_type,
	      	  secure_url      : data.secure_url,
	      	  signature     : data.signature,
	      	  // tags       : data.tags,
	      	  type        : data.type,
	      	  url         : data.url,
	      	  version       : data.version,
	      	  width         : data.width 
	      	};
	      	$scope[type+'Uploaded'] = true;
	    }).error(function (data, status, headers, config) {
	      	$scope[type].result = data;
	    });
	  }
	};

	/* Modify the look and fill of the dropzone when files are being dragged over it */
	$scope.dragOverClass = function($event) {
	  var items = $event.dataTransfer.items;
	  var hasFile = false;
	  if (items != null) {
	    for (var i = 0 ; i < items.length; i++) {
	      if (items[i].kind == 'file') {
	        hasFile = true;
	        break;
	      }
	    }
	  } else {
	    hasFile = true;
	  }
	  return hasFile ? "dragover" : "dragover-err";
	};

	projectDetailService.getProject($stateParams.projectId, true)
	.success(function(project){
		$scope.project = project;
		// if(!$scope.project.category) {
		// 	$scope.project.category = 'music';
		// }
		if($stateParams.productGroupId) {
			$scope.selectedProductGroup = _.findWhere($scope.project['productGroupTimeLine'], { _id: $stateParams.productGroupId});
			if($stateParams.productId) {
				$scope.openAddProductModal(_.findIndex($scope.selectedProductGroup.products, { _id: $stateParams.productId}));
			} else {
				$scope.openAddProductGroupModal(_.findIndex($scope.project['productGroupTimeLine'], { _id: $stateParams.productGroupId}));
			}
		} else {
			$scope.selectedProductGroup = $scope.project['productGroupTimeLine'][0];
		}
	})
	.error(function(err) {
		console.log('error fetching project details', err);
	})
    
});