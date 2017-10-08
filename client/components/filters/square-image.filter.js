'use strict';

angular.module('cmsShoppableApp')

.filter('squareImage', function() {
	return function(picture) {
		if(!picture || !picture.public_id ) { return ''; }
		// console.log('filter', picture);
		var format = picture.url.substr(picture.url.lastIndexOf('.')+1);
		return 'http://res.cloudinary.com/shoppablevid/image/upload/c_thumb,h_128,w_128/'+ picture.public_id +'.'+format;
	}
})