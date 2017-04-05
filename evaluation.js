'use strict';

(function () {

	const
		util = require('./util'),
		referenceObj = {
			id: false,
			created: false,
			testerId: true,
			testeeId: true,
			sourceId: true,
			targetId: true,
			ranking: true,
			comment: false
		},
		endpointName = 'evaluation';

	var evaluation = {

		name: () => endpointName,

		create: (inObj) =>

			util.verifyRequiredProperties(inObj, referenceObj)
				.then(() => util.createHash(inObj, referenceObj, endpointName)),

		get: (inObj) => util.getHash(inObj, endpointName),

		update: (inObj) => util.updateHash(inObj, referenceObj, endpointName),

		delete: (inObj) => util.deleteHash(inObj, endpointName)

	}

	module.exports = evaluation;

})();