'use strict';

(function(exports){

	THREE.Object3D.prototype.getChildByType = function(type)
	{
		for(var i=0; i<this.children.length; i++)
			if(this.children[i] instanceof type)
				return this.children[i];
	}
	
	THREE.Object3D.prototype.getChildByName2 = function(name)
	{
		for(var i=0; i<this.children.length; i++)
			if(this.children[i].name === name)
				return this.children[i];
	}

	function reparent(obj, parent)
	{
		// shuffle hierarchy, but keep world transform the same
		if(parent && parent !== obj.parent)
		{
			obj.applyMatrix(obj.parent.matrixWorld);
			var mat = new THREE.Matrix4().getInverse(parent.matrixWorld);
			obj.applyMatrix(mat);

			parent.add(obj);

			obj.updateMatrix();
		}
	}

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
		reparent(stage2, root);
		reparent(stage1, stage2);

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
		reparent(stage2, root);
		reparent(stage1, stage2);

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

	exports.reparent = reparent;

	exports.moveUp = moveUp;
	exports.moveDown = moveDown;
	exports.focusStage1 = focusStage1;
	exports.focusStage2 = focusStage2;
	exports.focusStage3 = focusStage3;

})(window.Utils = window.Utils || {});
