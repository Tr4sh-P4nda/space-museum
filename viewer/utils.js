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

	/*
	 * Animate the target from transform to transform over time
	 * Alternate prototype: Animate(finalMatrix, duration, callback)
	 */

	function Animate(finalParent, finalPos, finalQuat, finalScale, duration, callback)
	{
		this.parent = finalParent || null;

		if(finalPos instanceof THREE.Matrix4)
		{
			// extract position/rotation/scale from matrix
			this.finalPos = new THREE.Vector3();
			this.finalQuat = new THREE.Quaternion();
			this.finalScale = new THREE.Vector3();
			finalPos.decompose(this.finalPos, this.finalQuat, this.finalScale);

			// shift other arguments
			duration = finalQuat;
			callback = finalScale;
		}
		else
		{
			this.finalPos = finalPos;
			this.finalQuat = finalQuat;
			this.finalScale = finalScale;
		}
		this.parent = finalParent || null;
		this.duration = duration || 600;
		this.callback = callback;
	}

	Animate.prototype.awake = function(obj)
	{
		this.target = obj;

		// remove any other animations in progress
		var self = this;
		obj.__behaviorList.forEach(function(subobj, i, arr){
			if( subobj instanceof Animate && subobj != self )
			{
				if(subobj.callback) subobj.callback(obj);
				obj.removeBehavior(subobj);
			}
		});

		// shuffle hierarchy, but keep world transform the same
		if(this.parent && this.parent !== obj.parent)
		{
			obj.applyMatrix(obj.parent.matrixWorld);
			var mat = new THREE.Matrix4().getInverse(this.parent.matrixWorld);
			obj.applyMatrix(mat);

			this.parent.add(obj);
		}

		// read initial positions
		this.initialPos = obj.position.clone();
		this.initialQuat = obj.quaternion.clone();
		this.initialScale = obj.scale.clone();
		this.startTime = Date.now();
	};

	Animate.prototype.update = function(deltaT)
	{
		// compute ease-out based on duration
		var mix = (Date.now()-this.startTime) / this.duration;
		mix = mix < 1 ? -mix * (mix-2) : 1;

		// animate position if requested
		if( this.finalPos ){
			this.target.position.lerpVectors(this.initialPos, this.finalPos, mix);
		}

		// animate rotation if requested
		if( this.finalQuat ){
			THREE.Quaternion.slerp(this.initialQuat, this.finalQuat, this.target.quaternion, mix)
		}

		// animate scale if requested
		if( this.finalScale ){
			this.target.scale.lerpVectors(this.initialScale, this.finalScale, mix);
		}

		this.target.updateMatrix();
		
		// terminate animation when done
		if(mix >= 1){
			this.target.removeBehavior(this);
			if(this.callback)
				this.callback.call(this.target);
		}
	};

	function moveUp(amt)
	{
		amt = amt || 1;
		var animation = model.getBehaviorByType(Animate);
		var newPos = animation ? animation.finalPos.clone() : model.position.clone();
		newPos.setZ( newPos.z + amt );
		
		if(model.name === 'Stage1' && newPos.z < 30)
			model.addBehavior(new Animate(null, newPos, null, null));
	}
	
	function moveDown(amt)
	{
		amt = amt || 1;
		var animation = model.getBehaviorByType(Animate);
		var newPos = animation ? animation.finalPos.clone() : model.position.clone();
		newPos.setZ( newPos.z - amt );
		
		if(model.name === 'Stage1' && newPos.z > -40)
			model.addBehavior(new Animate(null, newPos, null, null));
	}
	
	function focusStage1()
	{
		// position stage 1
		stage1.traverse(function(o){ o.visible = true; });
		stage1.addBehavior(new Animate(root,
			new THREE.Vector3(0,0,22),
			new THREE.Quaternion(0, 0, -0.38268343372150415, 0.923879526523784)
		));

		// position stage 2
		stage2.addBehavior(new Animate(stage1,
			new THREE.Vector3(0,0,24.165),
			new THREE.Quaternion()
		));
	}

	function focusStage2()
	{
		
	}

	function focusStage3()
	{
		
	}

	exports.Animate = Animate;
	exports.moveUp = moveUp;
	exports.moveDown = moveDown;

})(window.Utils = window.Utils || {});
