'use strict';

// set up global variables
var renderer, camera, model, controls;
var scene = new THREE.Scene();
var root = new THREE.Object3D();
scene.add(root);

var infoRoot = new THREE.Object3D();
/*var temp = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color:0xffcccc}));
temp.position.set(0,0,0.5);
infoRoot.add(temp);*/
scene.add(infoRoot);

// start loading everything in the right order
async.parallel(
	[
		loadTextures,
		loadModels,
		setupRenderer,
		setupEnclosure
	],
	start
);

function loadTextures(done)
{
	var texLoader = new THREE.TextureLoader();
	async.map(
		[
			'falcon9baked.png',
			'stage2baked.png',
			'controlpanelbaked.png',
			'overview.png',
			'first.png',
			'second.png',
			'arrow.png'
		],

		function(item, done)
		{
			// load each texture
			texLoader.load('textures/'+item,

				// and return it if successful
				function(tex){
					done(null, new THREE.MeshBasicMaterial({map: tex, side: THREE.DoubleSide}));
				},
				null,

				// otherwise return the error
				function(xhr){
					done(xhr.statusText);
				}
			);
		},

		// finish once all textures are loaded
		done
	);
}


function loadModels(done)
{
	async.map(
		['falcon9.gltf', 'controlpanel.gltf'],

		function(item, done)
		{
			console.log('loading', item);
			var gltfLoader = new THREE.glTFLoader();
			gltfLoader.load('models/'+item, function(obj){
				done(null, obj.scene.children[0].children[0]);
			});
		},
		done
	);
}


function setupRenderer(done)
{
	if(altspace.inClient){
		renderer = altspace.getThreeJSRenderer();
	}
	else {
		// set up preview renderer, in case we're out of world
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(720, 720);
		renderer.setClearColor( 0x888888 );
		document.body.appendChild(renderer.domElement);

		camera = new THREE.PerspectiveCamera(90, 1, 0.01, 10000);
		camera.up.set(0,0,1);
		camera.position.set(0, -10, 1.5);
		camera.rotation.set(2.15, 0, 0);
		root.add(camera);

		// set up cursor emulation
		altspace.utilities.shims.cursor.init(scene, camera, {renderer: renderer});
	}

	done();
}


function setupEnclosure(done)
{
	if(altspace.inClient)
	{
		altspace.getEnclosure().then(function(e)
		{
			root.position.set(32, -151.25, 32);
			root.scale.multiplyScalar(e.pixelsPerMeter);
			root.rotation.set( -Math.PI/2, 0, 0 );

			infoRoot.position.set(-38, -176, 203);
			infoRoot.scale.multiplyScalar(e.pixelsPerMeter);
			infoRoot.rotation.set( -Math.PI/2, 0, 0 );
			done();
		});
	}
	else {
		done();
	}
}

function start(err, results)
{
	if(err){
		console.error(err);
		return;
	}
	console.log(results);

	// texture the model
	var materials = {
		stage1: results[0][0],
		stage2: results[0][1], 
		controlpanel: results[0][2],
		infoOverview: results[0][3],
		infoFirst: results[0][4],
		infoSecond: results[0][5],
		infoArrow: results[0][6]
	};
	model = results[1][0];
	// place display rocket
	var scaleModel = model.clone();
	scaleModel.name = 'scaleModel';
	scaleModel.scale.set(.08, .08, .08);
	scaleModel.position.set(0, 0, 1.6);
	scaleModel.rotateZ(-Math.PI/2);
	scaleModel.updateMatrix();
	infoRoot.add(scaleModel);

	addInfoPanels(materials);

	addArrows(materials);

	// start animating
	window.requestAnimationFrame(function animate(timestamp)
	{
		window.requestAnimationFrame(animate);
		scene.updateAllBehaviors();
		renderer.render(scene, camera);
	});

}


function addInfoPanels(materials) 
{
	var overviewPanel = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		materials.infoOverview
	);
	overviewPanel.position.set(1, 0, 0.5);
	overviewPanel.rotation.set(0, 0.872, 1.57);
	overviewPanel.scale.set(2.5, 0.7, 1);
	infoRoot.add(overviewPanel);

	var firstPanel = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		materials.infoFirst
	);
	firstPanel.position.set(0, -1, 1.5);
	firstPanel.rotation.set(1.5699, 1.5701, 0);
	firstPanel.scale.set(1, 1.2, 1);
	infoRoot.add(firstPanel);

	var secondPanel = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		materials.infoSecond
	);
	secondPanel.position.set(0, 1, 3.2);
	secondPanel.rotation.set(3.141, 1.047, -1.5707);
	secondPanel.scale.set(1, 1.2, 1);
	infoRoot.add(secondPanel);
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
