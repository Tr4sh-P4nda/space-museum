'use strict';

// set up global variables
var stage1, stage2, fairing1, fairing2;
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
			'second.png'
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
		infoSecond: results[0][5]
	};
	model = results[1][0];
	model.traverse(function(o)
	{
		var stage1names = ['Stage1','Engines','Engine_001','Legs','Grid_Fins'];
		var stage2names = ['Stage2','Engine_2','Fairing','Fairing_001','Payload'];

		var mesh = o.getChildByType(THREE.Mesh);

		if(stage1names.indexOf(o.name) > -1)
			mesh.material = materials.stage1;
		else if(stage2names.indexOf(o.name) > -1)
			mesh.material = materials.stage2;

		switch(o.name){
			case 'Stage1': stage1 = o; break;
			case 'Stage2': stage2 = o; break;
			case 'Fairing': fairing1 = o; break;
			case 'Fairing_001': fairing2 = o; break;
		}
	});

	// place rocket
	model.translateZ(22);
	model.rotateZ(-Math.PI/2);
	model.updateMatrix();
	root.add(model);

	// place display rocket
	var scaleModel = model.clone();
	scaleModel.name = 'scaleModel';
	scaleModel.scale.set(.08, .08, .08);
	scaleModel.position.set(0, 0, 1.6);
	scaleModel.rotateZ(-Math.PI/2);
	scaleModel.updateMatrix();
	infoRoot.add(scaleModel);

	addInfoPanels(materials);

	// texture the control panel
	controls = results[1][1];
	controls.traverse(function(o){
		if(o instanceof THREE.Mesh)
			o.material = materials.controlpanel;
	});

	// place panel
	controls.position.set(0, -6, 1);
	controls.updateMatrix();
	root.add(controls);
	
	// hook up controls
	var interval;
	function buttonup(){
		clearInterval(interval);
	}

	// move up
	var button = controls.getChildByName2('MoveUp');
	button.addEventListener('cursordown', function(){
		Utils.moveUp();
		interval = setInterval(Utils.moveUp, 200);
	});
	button.addEventListener('cursorup', buttonup);
	button.addEventListener('cursorleave', buttonup);

	// move down
	button = controls.getChildByName2('MoveDown');
	button.addEventListener('cursordown', function(){
		Utils.moveDown();
		interval = setInterval(Utils.moveDown, 200);
	});
	button.addEventListener('cursorup', buttonup);
	button.addEventListener('cursorleave', buttonup);

	// stage 1
	button = controls.getChildByName2('Stage1');
	button.addEventListener('cursorup', Utils.focusStage1);

	// stage 2
	button = controls.getChildByName2('Stage2');
	button.addEventListener('cursorup', Utils.focusStage2);

	// stage 3
	button = controls.getChildByName2('Stage3');
	button.addEventListener('cursorup', Utils.focusStage3);

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
	editor.edit(firstPanel);
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
