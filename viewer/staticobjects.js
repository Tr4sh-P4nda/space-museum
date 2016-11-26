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
		var scaleRoot = new THREE.Object3D(); scaleRoot.name = 'scaleRoot';
		setTransform(assets.models.rocket, [-0.05656854063272476, 0, 0.05656854063272476, 0, 0.05656854063272476, 0, 0.05656854063272476, 0, 0, 0.08, 0, 0, 0, 1.75, 0, 1]);
		setTransform(assets.posters.info1, [0, 0, -1.2, 0, 0, 1.2, 0, 0, 1.2, 0, 0, 0, 0, 1.5, 1, 1]);
		setTransform(assets.posters.info2, [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1.5, -1, 1]);
		setTransform(assets.posters.info3, [0, 0, -2.5, 0, -1.7677669525146484, 1.7677669525146484, 0, 0, 1.7677669525146484, 1.7677669525146484, 0, 0, 1, 0.5, 0, 1]);
		scaleRoot.add(assets.models.rocket, assets.posters.info1, assets.posters.info2, assets.posters.info3);
		scaleRoot.position.set(-27, 0, 1.8);

		/*
		 * place arrows
		 */
		// set up template
		var arrowRoot = new THREE.Object3D(); arrowRoot.name = 'arrowRoot';
		var temp = assets.posters.arrow;
		temp.material.map.wrapT = THREE.RepeatWrapping;
		temp.material.map.wrapS = THREE.RepeatWrapping;
		temp.material.map.repeat.y = 5;
		temp.material.transparent = true;
		temp.scale.set(.85, 4.26, 1);
		temp.userData.altspace = {collider: {enabled: false}};

		var positions = [
			[-22, 0.01, -5],
			[-14, 0.01, -4],
			[-10, 1.75, -10.3],
			[-0.2, 3, -10],
			[0, 4.3, -13.2],
			[-6.5, 4.3, -13.7]
		];
		var rotations = [
			[-1.5707962827705675, 0, -2.0943951617841434],
			[-1.5707963484304415, 3.8192581541807165e-8, 0],
			[-1.5707962886023292, 2.163553780576422e-8, -1.570796395844246],
			[-1.5707962900545052, -0.3490657666126316, -1.5707964138930883],
			[-1.5707963561444291, -1.2774839319718047e-7, 1.5707963267948966],
			[-1.570796394526992, -1.0028011132590126e-7, 1.2217304725064826]
		];

		// generate arrows
		for(var i=0; i<6; i++){
			var arrow = i===0 ? temp : temp.clone();
			arrow.name = 'arrow'+i;
			arrow.position.set.apply(arrow.position, positions[i] || [0,0,0]);
			arrow.rotation.set.apply(arrow.rotation, rotations[i] || [0,0,0]);
			arrowRoot.add(arrow);
		}

		// add panorama ball
		var marsBall = new THREE.Mesh(
			new THREE.SphereGeometry(1.5, 32, 16),
			new THREE.MeshBasicMaterial({map: assets.textures.mars_pano})
		);
		marsBall.name = 'marsBall';
		marsBall.material.side = THREE.BackSide;
		marsBall.material.map.wrapS = THREE.RepeatWrapping;
		marsBall.material.map.offset.setX(0.5);
		marsBall.userData.altspace = {collider: {enabled: false}};
		marsBall.position.set(12, 1.5, -1);

		// add memorial
		var memorialRoot = new THREE.Object3D(); memorialRoot.name = 'memorialRoot';
		assets.posters.memwall.position.set(0,0,-1);
		assets.posters.memwall.scale.setScalar(2.5);
		assets.posters.memquote.position.set(-2, 0, -0.5);
		assets.posters.memquote.rotation.set(0, Math.PI/6, 0);
		assets.posters.memquote.scale.setScalar(1.5);
		memorialRoot.add(assets.posters.memwall, assets.posters.memquote);
		memorialRoot.position.set(1,1.3,-8);

		// add rocket equation poster
		var rocketEq = assets.posters.rocketeq; rocketEq.name = 'rocketEq';
		rocketEq.scale.setScalar(2.5);
		rocketEq.position.set(10, 6.2, -13.8);

		root.add(scaleRoot, arrowRoot, marsBall, memorialRoot, rocketEq);
	};


	exports.assets = {
		models: {
			rocket: 'models/falcon9.gltf',
		},
		textures: {
			mars_pano: 'textures/mars_pano.jpg'
		},
		posters: {
			info1: 'textures/first.png',
			info2: 'textures/second.png',
			info3: 'textures/overview.png',
			arrow: 'textures/arrow.png',
			memwall: 'textures/memorial.png',
			memquote: 'textures/memorial-quote.png',
			rocketeq: 'textures/rocket-equation.png'
		}
	};

})(window.StaticObjects = window.StaticObjects || {});