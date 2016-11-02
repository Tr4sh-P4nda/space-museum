'use strict';

(function(exports)
{
	var template = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1)
	);

	exports.initialize = function(env, root, assets)
	{
		// add mars panorama
		var marsBall = new THREE.Mesh(
			new THREE.SphereGeometry(1.5, 32, 16),
			new THREE.MeshBasicMaterial({map: assets.textures.mars_pano})
		);
		marsBall.material.side = THREE.BackSide;
		marsBall.material.map.wrapS = THREE.RepeatWrapping;
		marsBall.material.map.offset.setX(0.5);
		marsBall.userData.altspace = {collider: {enabled: false}};
		root.add(marsBall);
	}

	exports.assets = {
		textures: {
			mars_pano: 'textures/mars_pano.jpg'
		}
	};

})(window.panorama = window.panorama || {});
