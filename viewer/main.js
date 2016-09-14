'use strict';

// set up global variables
var renderer, camera, scaleFactor;
var scene = new THREE.Scene();

// set up renderer and scale
if(altspace.inClient)
{
	renderer = altspace.getThreeJSRenderer();
	altspace.getEnclosure().then(function(e){
		scaleFactor = e.pixelsPerMeter;
		scene.userData.encl = e;
		scene.scale.multiplyScalar(e.pixelsPerMeter);
		start();
	});
}
else
{
	// set up preview renderer, in case we're out of world
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(720, 720);
	renderer.setClearColor( 0x888888 );
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(90, 1, 0.01, 10000);
	camera.position.set(0, -10, 1.5);
	camera.rotation.set(2.15, 0, 0);
	scene.add(camera);

	// set up cursor emulation
	altspace.utilities.shims.cursor.init(scene, camera, {renderer: renderer});

	// don't change scale
	scaleFactor = 1;
	scene.userData.enclosure = {innerWidth: 1024, innerHeight: 1024, innerDepth: 1024, pixelsPerMeter: 1024/3};

	start();
}


function start()
{
	// construct vignettes
	[
		'real_rocket',
		'scale_rocket',
		'arrows'
	].forEach(function(id)
	{
		var module = Diorama[id];
		var root = new THREE.Object3D();
		scene.add(root);

		Diorama.loadAssets(module.assets, function(results)
		{
			module.initialize(root, results);
		});
	});

	// start animating
	window.requestAnimationFrame(function animate(timestamp)
	{
		window.requestAnimationFrame(animate);
		scene.updateAllBehaviors();
		renderer.render(scene, camera);
	});

}



