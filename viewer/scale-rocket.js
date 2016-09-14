'use strict';

(function(exports)
{
	exports.initialize = function(infoRoot, assets)
	{
		infoRoot.name = 'scaleRoot';
		infoRoot.position.set(-12.98, -15.14, 29.89);
		infoRoot.rotation.set( -Math.PI/2, 0, 0 );

		// place display rocket
		var scaleModel = assets.models.rocket;
		scaleModel.name = 'scaleModel';
		scaleModel.scale.set(.08, .08, .08);
		scaleModel.position.set(0, 0, 1.6);
		scaleModel.rotateZ(Math.PI);
		scaleModel.updateMatrix();
		infoRoot.add(scaleModel);

		var overviewPanel = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			new THREE.MeshBasicMaterial({map: assets.textures.infoOverview})
		);
		overviewPanel.position.set(1, 0, 0.5);
		overviewPanel.rotation.set(0, 0.872, 1.57);
		overviewPanel.scale.set(2.5, 0.7, 1);
		infoRoot.add(overviewPanel);

		var firstPanel = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			new THREE.MeshBasicMaterial({map: assets.textures.infoFirst})
		);
		firstPanel.position.set(0, -1, 1.5);
		firstPanel.rotation.set(1.5699, 1.5701, 0);
		firstPanel.scale.set(1, 1.2, 1);
		infoRoot.add(firstPanel);

		var secondPanel = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			new THREE.MeshBasicMaterial({map: assets.textures.infoSecond})
		);
		secondPanel.position.set(0, 1, 3.2);
		secondPanel.rotation.set(3.141, 1.047, -1.5707);
		secondPanel.scale.set(1, 1.2, 1);
		infoRoot.add(secondPanel);
	}


	exports.assets = {
		models: {
			rocket: 'models/falcon9.gltf',
		},
		textures: {
			infoOverview: 'textures/overview.png',
			infoFirst: 'textures/first.png',
			infoSecond: 'textures/second.png'
		}
	};

})(window.Diorama.scale_rocket = window.Diorama.scale_rocket || {});
