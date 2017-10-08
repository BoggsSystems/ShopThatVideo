'use strict';

angular.module('cmsShoppableApp')
.controller('AddProductGroupCtrl', function ($scope, $uibModalInstance, productGroup, project, editIndex, Upload, projectDetailService) {

  $scope.productGroup = productGroup;
  $scope.project = project;
  
  $scope.save = function (valid, productGroup) {
    if(!valid || !$scope.productGroup.thumbnail) {
      return false;
    }
    // console.log('project._id', project._id, editIndex);
    productGroup.projectId = project._id;
    $scope.disableButton = true;
    if(editIndex>=0) {
      projectDetailService.updateProductGroup($scope.productGroup)
      .success(function(productGroup){
        $uibModalInstance.close({
          productGroup:productGroup, 
          editIndex: editIndex
        });
      })
      .error(function(error){
        $scope.disableButton = false;
        $scope.error = error;
        console.log(error);
      });
    } else {
      projectDetailService.addProductGroup($scope.productGroup)
      .success(function(productGroup){
        $uibModalInstance.close({ productGroup: productGroup });
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

  $scope.uploadFiles = function(file){
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
        $scope.file.result = data;
        $scope.productGroup.thumbnail = {
          bytes       : data.bytes,
          created_at      : data.created_at,
          // etag       : data.etag,
          format        : data.format,
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
        $scope.imageUploaded = true;
        // console.log('data', data);
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