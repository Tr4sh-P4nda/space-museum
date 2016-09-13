'use strict';

(function(exports)
{
	exports.initialize = function(root, assets)
	{
		console.log('adding arrows', root, assets);
		
		root.add( new THREE.Mesh(
			new THREE.SphereGeometry(40, 32, 32), new THREE.MeshBasicMaterial()));
			
		var arrowMat = new THREE.MeshBasicMaterial({map: assets.textures.infoArrow});
		arrowMat.map.wrapS = THREE.RepeatWrapping;
		arrowMat.map.repeat.y = 5;
		arrowMat.transparent = true;
		arrowMat.side = THREE.DoubleSided;
		
		var arrows0 = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			arrowMat
		);
		arrows0.name = 'arrows0';
		arrows0.position.set(0, 0, 0);
		arrows0.rotation.set(-1.5707962827705675, 0, -2.0943951617841434);
		arrows0.scale.set(5, 25, 10);
		root.add(arrows0);
		
		var arrows1 = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			arrowMat
		);
		arrows1.name = 'arrows1';
		arrows1.position.set(0, -176.4, 170);
		arrows1.rotation.set(-1.5707962827705675, 0, -2.0943951617841434);
		arrows1.scale.set(5, 25, 10);
		root.add(arrows1);

		var arrows2 = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			arrowMat
		);
		arrows2.name = 'arrows2';
		arrows2.position.set(35, -176.2, 172);
		arrows2.rotation.set(-1.5707963484304415, 3.8192581541807165e-8, 0);
		arrows2.scale.set(5, 25, 10);
		root.add(arrows2);

		var arrows3 = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			arrowMat
		);
		arrows3.name = 'arrows3';
		arrows3.position.set(60, -166.3, 135);
		arrows3.rotation.set(-1.5707962886023292, 2.163553780576422e-8, -1.570796395844246);
		arrows3.scale.set(5, 25, 10);
		root.add(arrows3);

		var arrows4 = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			arrowMat
		);
		arrows4.name = 'arrows4';
		arrows4.position.set(110, -161.1, 135);
		arrows4.rotation.set(-1.5707962900545052, -0.3490657666126316, -1.5707964138930883);
		arrows4.scale.set(5, 25, 10);
		root.add(arrows4);

		var arrows5 = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			arrowMat
		);
		arrows5.name = 'arrows5';
		arrows5.position.set(110, -151.1, 118);
		arrows5.rotation.set(-1.5707963561444291, -1.2774839319718047e-7, 1.5707963267948966);
		arrows5.scale.set(5, 25, 10);
		root.add(arrows5);

		var arrows6 = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			arrowMat
		);
		arrows6.name = 'arrows6';
		arrows6.position.set(75, -151.1, 113);
		arrows6.rotation.set(-1.570796394526992, -1.0028011132590126e-7, 1.2217304725064826);
		arrows6.scale.set(5, 25, 10);
		root.add(arrows6);
	}
	
	exports.assets = {
		textures: {
			infoArrow: 'textures/arrow.png'
		}
	};
	
})(window.Diorama.arrows = window.Diorama.arrows || {});
