'use strict';


(function () {

	const
		util = require('./util'),
		referenceObj = {
			id: false,
			created: false,
			authorId: true,
			sourceId: true,
			source: true,
			targetId: true
		},
		endpointName = 'translation-test';

	const translationTest = {

		name: () => endpointName,

		create: (inObj) =>

			util.verifyRequiredProperties(inObj, referenceObj)
				.then(() => util.createHash(inObj, referenceObj, endpointName)),

		get: (inObj) => util.getHash(inObj, endpointName),

		update: (inObj) => util.updateHash(inObj, referenceObj, endpointName),

		delete: (inObj) => util.deleteHash(inObj, endpointName)

	}

	module.exports = translationTest;

})();