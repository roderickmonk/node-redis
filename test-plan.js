'use strict';

(function () {

	const
		util = require('./util'),
		endpointName = 'test-plan',
		referenceObj = {
			id: false,
			sourceId: true,
			targetId: true,
			levels: true,
		};

	let testPlanObj;

	const testPlan = {

		name: () => endpointName,

		create: (inObj) => 

			util.verifyRequiredProperties(inObj, referenceObj)

				// Ensure language ids are known
				.then(() => util.isIdKnown('language-ids', inObj.sourceId))
				.then(() => util.isIdKnown('language-ids', inObj.targetId))

				// Record languages as in use
				.then(() => r.hincrby('language-use', `${inObj.sourceId}`, 1))
				.then(() => r.hincrby('language-use', `${inObj.targetId}`, 1))

				.then(() => util.createHash(inObj, referenceObj, endpointName)),

		get: (inObj) => util.getHash(inObj, endpointName),

		update: (inObj) => util.updateHash(inObj, referenceObj, endpointName),

		delete: (inObj) => 

			util.getHash(inObj)

				// Decrement the counts for the 2 languages
				.then(obj => { testPlanObj = _.assign(obj); return r.hincrby('language-use', `${testPlanObj.sourceId}`, -1); })
				.then(() => r.hincrby('language-use', `${testPlanObj.targetId}`, -1))

				// Then the delete
				.then(() => util.deleteHash(inObj, endpointName)),

		// Get Test Plans that are complete
		complete: () => util.getCompleteTestPlans()
	}

	module.exports = testPlan;

})();
