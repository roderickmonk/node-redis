'use strict';


(function () {

	const
		util = require('./util'),
		referenceObj = {
			id: false,
			created: false,
			testeeId: true,
			translationTestId: true,
			target: true,
		},
		endpointName = 'translation-test-result';

	var translationTestResult = {

		name: () => endpointName,

		create: (inObj) =>

			util.verifyRequiredProperties(inObj, referenceObj)
				.then(() => util.createHash(inObj, referenceObj, endpointName)),

		get: (inObj) => util.getHash(inObj, endpointName),

		update: (inObj) => util.updateHash(inObj, referenceObj, endpointName),

		delete: (inObj) => util.deleteHash(inObj, endpointName)

	}

	module.exports = translationTestResult;

})();