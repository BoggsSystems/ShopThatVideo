'use strict';

angular.module('cmsShoppableApp')

.factory('playVideoService', function($rootScope, $uibModal, $sce) {
	var playVideoModalInstance = null;
	
	var openVideoModal = function(project) {
		if(!project.media) {
			window.alert('Please upload video for the project first. Click on the project name to edit it.');
			return;
		}
		var modalScope = $rootScope.$new();
		modalScope.videoModalProject = project;

		modalScope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		playVideoModalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'components/services/play-video.html',
			scope: modalScope,
			backdrop: 'static',
			windowClass: 'play-video-modal'
		});
	};
	
	return {
		openVideoModal	: openVideoModal
	}
})