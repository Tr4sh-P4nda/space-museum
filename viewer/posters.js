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
		
		var ratio = width/height;
		p.scale.set(width, height, 1);

		return p;
	}

	exports.initialize = function(root, assets)
	{
		root.position.set(0, -14, 30);

		// add rocket equation poster
		var poster1 = generatePoster(assets.textures.rocket_equation, 2, 2);
		root.add(poster1);
	}

	exports.assets = {
		textures: {
			rocket_equation: 'textures/rocket-equation.png'
		}
	};

})(window.Diorama.posters = window.Diorama.posters || {});
