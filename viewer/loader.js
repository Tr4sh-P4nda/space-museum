'use strict';

(function()
{
	var modelCache = {};
	var textureCache = {};

	// loads an asset manifest from a scene
	function loadAssets(manifest, callback)
	{
		var waiting = 0;
		var payload = {};

		// load models
		if(manifest.models)
		{
			payload.models = {};

			// loop over each entry in the model manifest
			Object.keys(manifest.models).forEach(function(id)
			{
				var url = manifest.models[id];

				// check cache for asset
				if(modelCache[url]){
					payload.models[id] = modelCache[url].clone();
				}

				// load gltf models
				else if(/\.gltf$/.test(url))
				{
					// increment wait count
					waiting++;

					// start loader
					var loader = new THREE.glTFLoader();
					loader.load(url, function(result)
					{
						// write model to cache and payload
						modelCache[url] = result.scene.children[0].children[0];
						payload.models[id] = modelCache[url].clone();

						// finish
						checkComplete(true);
					});
				}
			});
		}

		if(manifest.textures)
		{
			payload.textures = {};

			// loop over each entry in the texture manifest
			Object.keys(manifest.textures).forEach(function(id)
			{
				var url = manifest.textures[id];

				// check cache for asset
				if(textureCache[url]){
					payload.textures[id] = textureCache[url].clone();
				}

				// load textures
				else
				{
					// increment wait count
					waiting++;
					
					// start loader
					var loader = new THREE.TextureLoader();
					loader.load(url,
						function(texture)
						{
							// write texture to cache and payload
							textureCache[url] = texture;
							payload.textures[id] = textureCache[url].clone();

							// finish
							checkComplete(true);
						}
					);
				}
			});
		}

		checkComplete();


		function checkComplete(done)
		{
			if(done) waiting--;
			if(waiting === 0)
				callback(payload);
		}
	}

	

	window.loadModule = loadModule;

})();
