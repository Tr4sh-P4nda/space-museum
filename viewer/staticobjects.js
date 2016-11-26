'use strict';

(function(exports){
	
	function setTransform(obj, xfrm){
		obj.matrixAutoUpdate = false;
		obj.matrix.fromArray(xfrm);
		obj.matrix.decompose(obj.position, obj.quaternion, obj.scale);
	}
	
	exports.initialize = function(env, root, assets)
	{
		// place display rocket
		window.scaleRoot = new THREE.Object3D();
		setTransform(assets.models.rocket, [-0.05656854063272476, 0, 0.05656854063272476, 0, 0.05656854063272476, 0, 0.05656854063272476, 0, 0, 0.08, 0, 0, 0, 1.75, 0, 1]);
		setTransform(assets.posters.info1, [0, 0, -1.2, 0, 0, 1.2, 0, 0, 1.2, 0, 0, 0, 0, 1.5, 1, 1]);
		setTransform(assets.posters.info2, [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1.5, -1, 1]);
		setTransform(assets.posters.info3, [0, 0, -2.5, 0, -1.7677669525146484, 1.7677669525146484, 0, 0, 1.7677669525146484, 1.7677669525146484, 0, 0, 1, 0.5, 0, 1]);		
		scaleRoot.add(assets.models.rocket, assets.posters.info1, assets.posters.info2, assets.posters.info3);

		root.add(scaleRoot);
	};


	exports.assets = {
		models: {
			rocket: 'models/falcon9.gltf',
		},
		posters: {
			info1: 'textures/first.png',
			info2: 'textures/second.png',
			info3: 'textures/overview.png'
		}
	};
	
})(window.StaticObjects = window.StaticObjects || {});