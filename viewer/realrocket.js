'use strict';

(function(exports)
{
	var stage1, stage2, fairing1, fairing2, model;

	exports.initialize = function(env, root, assets)
	{
		root.name = 'realRoot';
		root.rotation.set(-Math.PI/2, 0, 0);

		var rocket = assets.models.rocket;
		rocket.traverse(function(o)
		{
			switch(o.name){
				case 'Stage1': stage1 = o; break;
				case 'Stage2': stage2 = o; break;
				case 'Fairing': fairing1 = o; break;
				case 'Fairing_001': fairing2 = o; break;
			}
		});
		model = rocket;

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
			moveUp();
			interval = setInterval(moveUp, 200);
		});
		button.addEventListener('cursorup', buttonup);
		button.addEventListener('cursorleave', buttonup);

		// move down
		button = controls.getChildByName2('MoveDown');
		button.addEventListener('cursordown', function(){
			moveDown();
			interval = setInterval(moveDown, 200);
		});
		button.addEventListener('cursorup', buttonup);
		button.addEventListener('cursorleave', buttonup);

		// stage 1
		button = controls.getChildByName2('Stage1');
		button.addEventListener('cursorup', focusStage1);

		// stage 2
		button = controls.getChildByName2('Stage2');
		button.addEventListener('cursorup', focusStage2);

		// stage 3
		button = controls.getChildByName2('Stage3');
		button.addEventListener('cursorup', focusStage3);


		function moveUp(amt)
		{
			amt = amt || 1;
			var animation = model.getBehaviorByType(B.Animate);
			var newPos = animation ? animation.finalPos.clone() : model.position.clone();
			newPos.setZ( newPos.z + amt );

			if(model.name === 'Stage1' && newPos.z < 30 || model.name === 'Stage2' && newPos.z < 20)
				model.addBehavior(new B.Animate(null, newPos, null, null));
		}

		function moveDown(amt)
		{
			amt = amt || 1;
			var animation = model.getBehaviorByType(B.Animate);
			var newPos = animation ? animation.finalPos.clone() : model.position.clone();
			newPos.setZ( newPos.z - amt );

			if(model.name === 'Stage1' && newPos.z > -40 || model.name === 'Stage2' && newPos.z > -16.5)
				model.addBehavior(new B.Animate(null, newPos, null, null));
		}

		function focusStage1()
		{
			model = stage1;

			// position stage 1
			stage1.traverse(function(o){ o.visible = true; });
			stage1.addBehavior(new B.Animate(root,
				new THREE.Vector3(0,0,22),
				new THREE.Quaternion(0, 0, -0.38268343372150415, 0.923879526523784)
			));

			// position stage 2
			stage2.addBehavior(new B.Animate(stage1,
				new THREE.Vector3(0,0,24.165),
				new THREE.Quaternion()
			));

			// position fairings
			if(!fairing1.visible || fairing1.getBehaviorByType(B.DropOff))
			{
				fairing1.traverse(function(o){ o.visible = true; });
				fairing1.addBehavior(new B.Animate(stage2,
					new THREE.Vector3(0, 0, 9.853750228881836)
				));
				fairing2.traverse(function(o){ o.visible = true; });
				fairing2.addBehavior(new B.Animate(stage2,
					new THREE.Vector3(0, 0, 9.853750228881836)
				));
			}
		}

		function focusStage2()
		{
			model = stage2;

			// swap reference point
			Utils.reparent(stage2, root);
			Utils.reparent(stage1, stage2);

			// get rid of stage 1 if necessary
			if(stage1.visible && !stage1.getBehaviorByType(B.DropOff))
				stage1.addBehavior(new B.DropOff(null, 3000));

			// move stage 2 down to viewing height
			stage2.addBehavior(new B.Animate(root,
				new THREE.Vector3(0, 0, 5)
			));

			// position fairings
			if(!fairing1.visible || fairing1.getBehaviorByType(B.DropOff))
			{
				fairing1.traverse(function(o){ o.visible = true; });
				fairing1.addBehavior(new B.Animate(stage2,
					new THREE.Vector3(0, 0, 9.853750228881836)
				));

				fairing2.traverse(function(o){ o.visible = true; });
				fairing2.addBehavior(new B.Animate(stage2,
					new THREE.Vector3(0, 0, 9.853750228881836)
				));
			}
		}

		function focusStage3()
		{
			model = stage2;
			Utils.reparent(stage2, root);
			Utils.reparent(stage1, stage2);

			// get rid of stage 1 if necessary
			if(stage1.visible && !stage1.getBehaviorByType(B.DropOff))
				stage1.addBehavior(new B.DropOff(null, 3000));

			// move stage 2 down so you can see the payload
			stage2.addBehavior(new B.Animate(root,
				new THREE.Vector3(0, 0, -2.25)
			));

			// deploy fairings
			if(fairing1.visible && !fairing1.getBehaviorByType(B.DropOff))
			{
				B.abort(fairing1.getBehaviorByType(B.Animate));
				fairing1.addBehavior(new B.DropOff(
					new THREE.Vector3(4, 4, 0)
				));

				B.abort(fairing2.getBehaviorByType(B.Animate));
				fairing2.addBehavior(new B.DropOff(
					new THREE.Vector3(-4, -4, 0)
				));
			}
		}
	}

	exports.assets = {
		models: {
			rocket: 'models/falcon9.gltf',
			controlpanel: 'models/controlpanel.gltf'
		}
	};

})(window.RealRocket = window.RealRocket || {});
