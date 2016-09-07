'use strict';

(function(exports)
{
	var stage1, stage2, fairing1, fairing2;

	exports.initialize = function(root, assets)
	{
		var rocket = assets.models.rocket;
		rocket.traverse(function(o)
		{
			var stage1names = ['Stage1','Engines','Engine_001','Legs','Grid_Fins'];
			var stage2names = ['Stage2','Engine_2','Fairing','Fairing_001','Payload'];

			var mesh = o.getChildByType(THREE.Mesh);

			switch(o.name){
				case 'Stage1': stage1 = o; break;
				case 'Stage2': stage2 = o; break;
				case 'Fairing': fairing1 = o; break;
				case 'Fairing_001': fairing2 = o; break;
			}
		});

		// place rocket
		rocket.translateZ(22);
		rocket.rotateZ(-Math.PI/2);
		rocket.updateMatrix();
		root.add(rocket);


		// place panel
		var controls = assets.models.controlpanel;
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

	}

	exports.assets = {
		models: {
			rocket: 'models/falcon9.gltf',
			controlpanel: 'models/controlpanel.gltf'
		}
	};

})(window.Diorama.real_rocket = window.Diorama.real_rocket || {});
