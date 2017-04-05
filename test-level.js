'use strict';

(function () {

	const
		util = require('./util'),
		endpointName = 'test-level',
		referenceObj = {
			id: false,
			level: true,
			name: true,
			description: false
		};

	var testLevel = {

		name: () => endpointName,

		create: (inObj) =>

			util.verifyRequiredProperties(inObj, referenceObj)

				// Only one of each level permitted
				.then(() => util.addSetMember('level', inObj.level))
				.then(() => util.createHash(inObj, referenceObj, endpointName)),

		get: (inObj) => util.getHash(inObj, endpointName),

		getId: (level) => new Promise((resolve, reject) =>
			testLevel.get()
				.then(levels => {
					for (let i = 0; i < levels.length; ++i) {
						if (levels[i].level == level) {
							resolve(levels[i].id);
						}
					}
					reject(new ApiError('Test Level Unknown', 400));
				})
				.catch(reject)),

		update: (inObj) => util.updateHash(inObj, referenceObj, endpointName),

		delete: (inObj) => util.deleteHash(inObj, endpointName)
	}

	module.exports = testLevel;

})();