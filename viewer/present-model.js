'use strict';

// set up global variables
var renderer, camera;
var scene = new THREE.Scene();
var root = new THREE.Object3D();
scene.add(root);

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
		['falcon9baked.png', 'stage2baked.png'],

		function(item, done)
		{
			// load each texture
			texLoader.load('textures/'+item,

				// and return it if successful
				function(tex){
					done(null, new THREE.MeshBasicMaterial({map: tex}));
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
	var gltfLoader = new THREE.glTFLoader();
	gltfLoader.load('models/falcon9.gltf', function(obj){
		done(null, obj.scene.children[0].children[0]);
	});
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

		camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10000);
		camera.up.set(0,0,1);
		camera.position.set(0, -100, 0);
		camera.lookAt( new THREE.Vector3(0, 0, 35) );
		root.add(camera);
	}

	done();
}


function setupEnclosure(done)
{
	if(altspace.inClient)
	{
		altspace.getEnclosure().then(function(e){
			root.scale.multiplyScalar(e.pixelsPerMeter);
			root.position.setY( -e.innerHeight/2 );
			root.rotation.set( -Math.PI/2, 0, 0 );
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

	// texture the model
	var materials = {stage1: results[0][0], stage2: results[0][1]};
	var model = results[1];
	model.traverse(function(o)
	{
		var stage1 = ['Stage1','Engines','Engine_001','Legs','Grid_Fins'];
		var stage2 = ['Stage2','Engine_2','Fairing','Fairing_001','Payload'];

		var mesh = o.children.filter(function(c){ return c instanceof THREE.Mesh; })[0];

		if(stage1.indexOf(o.name) > -1)
			mesh.material = materials.stage1;
		else if(stage2.indexOf(o.name) > -1)
			mesh.material = materials.stage2;
	});

	// place rocket
	model.translateZ(22);
	model.rotateZ(-Math.PI/2);
	model.updateMatrix();

	// add model to the scene
	root.add(model);

	// start animating
	window.requestAnimationFrame(function animate(timestamp)
	{
		window.requestAnimationFrame(animate);
		renderer.render(scene, camera);
	});
}

