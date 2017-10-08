'use strict';

angular.module('cmsShoppableApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $sce, $state, $timeout, $uibModal, projectService, Auth) {
	// console.log('MainCtrl');
	var addProductGroupModalInstance = null;
	$scope.isLoggedIn = Auth.isLoggedIn;

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	};

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
		  // $log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.save = function(valid, project) {
		if(!valid) {
			return false;
		}
		projectService.addProject(project)
		.success(function(project){
			$state.go('project-detail', { projectId: project._id });
		})
		.error(function(err){
			console.log('err adding project');
		});
		addProductGroupModalInstance.close(project);
	};

	$scope.openVideoPlayer = function(project) {
		var win = window.open('http://video.shopthatvideo.com/#/ad/'+project._id, '_blank');
		win.focus();
	};

	$scope.openPlayer = function() {
		window.open('http://video.shopthatvideo.com/#/ad/588025b5dc9c1e0400ea271a');
	};

	function async(u, c) {
		var d = document, t = 'script',
				o = d.createElement(t),
				s = d.getElementsByTagName(t)[0];
		o.src = '//' + u;
		if (c) { o.addEventListener('load', function (e) { c(null, e); }, false); }
		s.parentNode.insertBefore(o, s);
	}

	$scope.openEmailModal = function() {
		$state.go('signup');
		// $uibModal.open({
		// 	templateUrl: 'app/main/subscribe.html'
		// })
		// async('s3.amazonaws.com/downloads.mailchimp.com/js/signup-forms/popup/embed.js', function() {
		// 	require(["mojo/signup-forms/Loader"], function(L) { 
		// 		L.start({ "baseUrl":"mc.us14.list-manage.com", "uuid":"70294f5eb324e7d75c46a64c2", "lid":"17ae313702"})
		// 	});
		// });
	};

	projectService.getPublishedProjects()
	.success(function(projectList){
		$scope.projectList = projectList;
		$timeout(function(){
			// Auto scroll to presentation area
			$("#menu_learnmore").click(function(e) {
				e.preventDefault();

				$('html, body').animate({
					scrollTop: $("#main_pres").offset().top
				}, 1000);
			});

			// Initialize slider
			videoSliderInit();
		}, 100);
	})
	.error(function(err){
		console.log('err fetching project list');
	})
	
});
