'use strict';

angular.module('cmsShoppableApp')
.controller('AddProductCtrl', function ($scope, $http, $uibModal, $uibModalInstance, editIndex, productGroup, product, Upload, projectDetailService) {

	$scope.productGroup = productGroup;
	$scope.product = product || {
		colors: [],
		sizes: [],
		images: []
	};
	$scope.sizeList = [
		{ id: 1, value:'XS' },
		{ id: 2, value:'S' },
		{ id: 3, value:'M' },
		{ id: 4, value:'L' },
		{ id: 5, value:'XL' },
		{ id: 6, value:'XXL' },
		{ id: 7, value:'XXX' }
	];
	
	$scope.addProductColor = function() {
		if (_.findWhere($scope.product.colors, $scope.currentColor) == null) {
		    $scope.product.colors.push($scope.currentColor);
		}
	};
	
	$scope.addProductSize = function() {
		if (_.findWhere($scope.product.sizes, $scope.size) == null) {
		    $scope.product.sizes.push($scope.size);
		}
	};

	$scope.save = function (valid) {
		if(!valid || $scope.product.images.length == 0) {
			return false;
		}
		// console.log('project._id', project._id, editIndex);
	    $scope.product.productGroupId = productGroup._id;
	    $scope.disableButton = true;
	    if(editIndex>=0) {
			projectDetailService.updateProduct($scope.product)
			.success(function(product){
				$uibModalInstance.close({ product: product, editIndex: editIndex});
			})
			.error(function(error){
				$scope.disableButton = false;
				$scope.error = error;
				console.log(error);
			});
	    } else {
			projectDetailService.addProduct($scope.product)
			.success(function(product){
				$uibModalInstance.close({ product: product });
			})
			.error(function(error){
				$scope.disableButton = false;
				$scope.error = error;
				console.log(error);
			});
	    }
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	var searchAmazonModalInstance = null;
	$scope.searchAmazon = function() {
		$scope.searchResults = [];
		$scope.searchKeyword = '';
		searchAmazonModalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: 'app/project-detail/product/search-amazon.html',
	      scope: $scope,
	      size: 'lg',
	      backdrop: 'static',
	      windowClass: 'search-amazon-modal'
	    });
	};

	$scope.search = function(keyword) {
		if(!keyword) {
			return;
		}
		$scope.searchingAmazon = true;
		$scope.searchResults = [];
		$http.get('/api/products/search/'+ keyword)
		.then(function(response) {
			// console.log(response);
			$scope.searchResults = response.data;
		}, function(err) {
			console.log(err);
			$scope.searchError = err;
		})
		.finally(function() {
			$scope.searchingAmazon = false;
		})
	};

	$scope.populateProduct = function(product) {
		searchAmazonModalInstance.close();
		var itemPrice = ((product.ItemAttributes[0].ListPrice && product.ItemAttributes[0].ListPrice[0].FormattedPrice[0]) || '').replace('$','');
		if(itemPrice == '') {
			itemPrice = ((product.OfferSummary[0].LowestNewPrice && product.OfferSummary[0].LowestNewPrice[0].FormattedPrice[0]) || '').replace('$','');
		}
		$scope.product = {
			name: (product.ItemAttributes && product.ItemAttributes[0].Title && product.ItemAttributes[0].Title[0]) || '',
			subtitle: (product.ItemAttributes && product.ItemAttributes.Label && product.ItemAttributes[0].Label[0]) || '',
			description: (product.ItemAttributes && product.ItemAttributes[0].Feature || []).join('. '),
			price: itemPrice,
			makeThisYourLookURL: (product.DetailPageURL && product.DetailPageURL[0]) || '',
			sizes: (product.ItemAttributes && product.ItemAttributes[0].Size) || [],
			colors: (product.ItemAttributes && product.ItemAttributes[0].Color) || [],
			images: _.map((product.ImageSets && product.ImageSets[0].ImageSet) || [], function(imageItem) {
				var imageUrl = '';
				if(imageItem.HiResImage && imageItem.HiResImage[0].URL) {
					imageUrl = imageItem.HiResImage[0].URL[0];
				} else if(imageItem.LargeImage && imageItem.LargeImage[0].URL) {
					imageUrl = imageItem.LargeImage[0].URL[0];
				} else if(imageItem.MediumImage && imageItem.MediumImage[0].URL) {
					imageUrl = imageItem.MediumImage[0].URL[0];
				}
				return { url: imageUrl };
			})
		};
		// console.log(product);
	};

	$scope.uploadFile = function(file, index){
		$scope.file = file;
		if (!$scope.file) return;
		if (file && !file.$error) {
			file.upload = Upload.upload({
				url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
				fields: {
					upload_preset: $.cloudinary.config().upload_preset,
					tags: 'product',
					// context: 'photo=' + $scope.title
				},
				file: file
			}).progress(function (e) {
				$scope.uploadProgress = Math.round((e.loaded * 100.0) / e.total);
				$scope.uploadStatus = "Uploading... " + $scope.uploadProgress + "%";
			}).success(function (data, status, headers, config) {
				// data.context = {custom: {photo: $scope.title}};
				// debugger;
				// console.log('data', data, index);
				$scope.file.result = data;
				$scope.product.images.push({
					bytes         		: data.bytes,
					created_at    		: data.created_at,
					// etag       		: data.etag,
					format        		: data.format,
					height        		: data.height,
					original_filename : data.original_filename,
					public_id     		: data.public_id,
					resource_type 		: data.resource_type,
					secure_url    		: data.secure_url,
					signature     		: data.signature,
					// tags       		: data.tags,
					type        			: data.type,
					url         			: data.url,
					version       		: data.version,
					width         		: data.width,
					imageUploaded 		: true
				});
				$scope.uploadProgress = 0;
				$scope.uploadStatus = '';
			}).error(function (data, status, headers, config) {
				$scope.file.result = data;
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
});