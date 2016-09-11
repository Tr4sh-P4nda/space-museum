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




	exports.reparent = reparent;

})(window.Utils = window.Utils || {});
