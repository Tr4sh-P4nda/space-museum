'use strict';

window.memorial = {
	
	initialize: function(env, root, assets)
	{
		root.position.set(15.81, -14, 16);
		/*root.add(new THREE.Mesh(
			new THREE.CubeGeometry(1,1,1),
			new THREE.MeshBasicMaterial()
		));*/

		var poster = new THREE.Mesh(
			new THREE.PlaneGeometry(2.5,2.5),
			new THREE.MeshBasicMaterial({map: assets.textures.wall})
		);
		poster.position.set(0,0,-1);
		window.memorial = poster;
		root.add(poster);
	},

	assets: {
		textures: {
			wall: 'textures/memorial.png'
		}
	}
};
