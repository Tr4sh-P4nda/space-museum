'use strict';

(function(exports)
{
	var template = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1)
	);

	function generatePoster(texture, width, height)
	{
		var p = template.clone();
		p.material = new THREE.MeshBasicMaterial({map: texture});
		p.material.side = THREE.DoubleSide;
		
		p.scale.set(width, height, 1);

		var ratio = width/height;
		if(ratio > 1){
			texture.repeat.set(1, 1/ratio);
			texture.offset.set(0, 1-1/ratio);
		}
		else {
			texture.repeat.set(1/ratio, 1);
			texture.offset.set(0, 0);
		}

		return p;
	}

	exports.initialize = function(env, root, assets)
	{
		root.position.set(0, -14, 30);

		// add rocket equation poster
		var poster1 = generatePoster(assets.textures.rocket_equation, 2.5,2.5);
		poster1.position.set(25, 0, -3);
		poster1.rotation.set(0, -Math.PI/2, 0);
		root.add(poster1);

		//var poster2 = generatePoster(assets.videos.landing_pov, 1.5 * 16/9, 1.5);
		//root.add(poster2);

		// add mars panorama
		var marsBall = new THREE.Mesh(
			new THREE.SphereGeometry(1.5, 32, 16),
			new THREE.MeshBasicMaterial({map: assets.textures.mars_pano})
		);
		marsBall.material.side = THREE.BackSide;
		marsBall.material.map.wrapS = THREE.RepeatWrapping;
		marsBall.material.map.offset.setX(0.5);
		marsBall.userData.altspace = {collider: {enabled: false}};
		marsBall.position.set(22, 0.12, -3);
		root.add(marsBall);
	}

	exports.assets = {
		textures: {
			rocket_equation: 'textures/rocket-equation.png',
			mars_pano: 'textures/mars_pano.jpg'
		},
		videos: {
			//landing_pov: 'textures/landing_pov.mkv'
		}
	};

})(window.Diorama.posters = window.Diorama.posters || {});
