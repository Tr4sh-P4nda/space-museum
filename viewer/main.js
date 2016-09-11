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
	//realRoot.position.set(32, -151.25, 32);
	realRoot.position.set(0, -512, 0);
	realRoot.rotation.set(-Math.PI/2, 0, 0);
	realRoot.scale.multiplyScalar(scaleFactor);
	scene.add(realRoot);

	// set up scale rocket root
	var scaleRoot = new THREE.Object3D();
	window.scaleRoot = scaleRoot;
	//scaleRoot.position.set(-38, -176, 203);
	scaleRoot.position.set(-600, -700, 1382);
	scaleRoot.rotation.set( -Math.PI/2, 0, 0 );
	scaleRoot.scale.multiplyScalar(scaleFactor);
	scene.add(scaleRoot);

	var roots = {
		real_rocket: realRoot,
		scale_rocket: scaleRoot
	};

	// actually construct vignettes
	['real_rocket', 'scale_rocket'].forEach(function(id)
	{
		var module = Diorama[id];
		Diorama.loadAssets(module.assets, function(results)
		{
			module.initialize(roots[id], results);
		});
	});

	//addArrows(materials);

	// start animating
	window.requestAnimationFrame(function animate(timestamp)
	{
		window.requestAnimationFrame(animate);
		scene.updateAllBehaviors();
		renderer.render(scene, camera);
	});

}


function addArrows(materials)
{
	materials.infoArrow.map.wrapS = THREE.RepeatWrapping;
	materials.infoArrow.map.repeat.y = 5;
	materials.infoArrow.transparent = true;
	var arrows1 = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		materials.infoArrow
	);
	arrows1.name = 'arrows1';
	arrows1.position.set(0, -176.4, 170);
	arrows1.rotation.set(-1.5707962827705675, 0, -2.0943951617841434);
	arrows1.scale.set(5, 25, 10);
	scene.add(arrows1);

	var arrows2 = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		materials.infoArrow
	);
	arrows2.name = 'arrows2';
	arrows2.position.set(35, -176.2, 172);
	arrows2.rotation.set(-1.5707963484304415, 3.8192581541807165e-8, 0);
	arrows2.scale.set(5, 25, 10);
	scene.add(arrows2);

	var arrows3 = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		materials.infoArrow
	);
	arrows3.name = 'arrows3';
	arrows3.position.set(60, -166.3, 135);
	arrows3.rotation.set(-1.5707962886023292, 2.163553780576422e-8, -1.570796395844246);
	arrows3.scale.set(5, 25, 10);
	scene.add(arrows3);

	var arrows4 = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		materials.infoArrow
	);
	arrows4.name = 'arrows4';
	arrows4.position.set(110, -161.1, 135);
	arrows4.rotation.set(-1.5707962900545052, -0.3490657666126316, -1.5707964138930883);
	arrows4.scale.set(5, 25, 10);
	scene.add(arrows4);

	var arrows5 = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		materials.infoArrow
	);
	arrows5.name = 'arrows5';
	arrows5.position.set(110, -151.1, 118);
	arrows5.rotation.set(-1.5707963561444291, -1.2774839319718047e-7, 1.5707963267948966);
	arrows5.scale.set(5, 25, 10);
	scene.add(arrows5);

	var arrows6 = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		materials.infoArrow
	);
	arrows6.name = 'arrows6';
	arrows6.position.set(75, -151.1, 113);
	arrows6.rotation.set(-1.570796394526992, -1.0028011132590126e-7, 1.2217304725064826);
	arrows6.scale.set(5, 25, 10);
	scene.add(arrows6);
}
