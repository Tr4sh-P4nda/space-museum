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

	start();
}


function start()
{
	// set up full-size rocket root
	var realRoot = new THREE.Object3D();
	realRoot.name = 'realRoot';
	//realRoot.position.set(32, -151.25, 32);
	realRoot.position.set(0, -512, 0);
	realRoot.rotation.set(-Math.PI/2, 0, 0);
	realRoot.scale.multiplyScalar(scaleFactor);
	scene.add(realRoot);

	// set up scale rocket root
	var scaleRoot = new THREE.Object3D();
	scaleRoot.name = 'scaleRoot';
	//scaleRoot.position.set(-38, -176, 203);
	scaleRoot.position.set(-600, -700, 1382);
	scaleRoot.rotation.set( -Math.PI/2, 0, 0 );
	scaleRoot.scale.multiplyScalar(scaleFactor);
	scene.add(scaleRoot);
	
	var arrowRoot = new THREE.Object3D();
	arrowRoot.name = 'arrowRoot';
	arrowRoot.position.set(0, 0, 0);
	arrowRoot.scale.multiplyScalar(scaleFactor);
	window.arrowRoot = arrowRoot;
	scene.add(arrowRoot);

	var roots = {
		real_rocket: realRoot,
		scale_rocket: scaleRoot,
		arrows: arrowRoot
	};

	// actually construct vignettes
	[/*'real_rocket',*/ 'scale_rocket', 'arrows'].forEach(function(id)
	{
		var module = Diorama[id];
		Diorama.loadAssets(module.assets, function(results)
		{
			module.initialize(roots[id], results);
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



