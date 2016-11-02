'use strict';

window.memorial = {
	
	initialize: function(env, root, assets)
	{
		/*root.add(new THREE.Mesh(
			new THREE.CubeGeometry(1,1,1),
			new THREE.MeshBasicMaterial()
		));*/

		var poster = new THREE.Mesh(
			new THREE.PlaneGeometry(2.5,2.5),
			new THREE.MeshBasicMaterial({map: assets.textures.wall})
		);
		poster.material.side = THREE.DoubleSide;
		poster.position.set(0,0,-1);
		root.add(poster);
		
		var quote = new THREE.Mesh(
			new THREE.PlaneGeometry(1.5, 0.75),
			new THREE.MeshBasicMaterial({map: assets.textures.quote})
		);
		quote.material.side = THREE.DoubleSide;
		quote.position.set(-2, 0, -0.5);
		quote.rotation.set(0, Math.PI/6, 0);
		root.add(quote);
	},

	assets: {
		textures: {
			wall: 'textures/memorial.png',
			quote: 'textures/memorial-quote.png'
		}
	}
};
