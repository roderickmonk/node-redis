'use strict';

(function () {

	const
		util = require('./util'),
		child = require('./question'),

		endpointName = 'test',
		parent = 'test-plan',
		referenceObj = {
			id: false,
			created: false,
			parentId: true,
			authorId: true,
			testLevelId: true,
			minCorrect: true,
			maxRetries: true,
			description: false
		};

	let
		objectId, testObj = {};

	const test = {

		name: () => endpointName,

		create: (inObj) => new Promise((resolve, reject) =>

			util.verifyRequiredProperties(inObj, referenceObj)

				// Record the test record
				.then(() => util.createHashWithParent(inObj, referenceObj, endpointName, parent))

				.then(obj => {
					testObj = _.assign(obj);
					objectId = obj.id;
					return r.hgetall(`test-level:${inObj.testLevelId}`);
				})

				// Maintain a set of test ids associated with the source, target, and test level
				.then(levelObj => r.sadd(`plan-level:${inObj.parentId}:${levelObj.level}`, objectId))
				.then(() => resolve(testObj))
				.catch(reject)),

		get: (inObj) => util.getHash(inObj, endpointName),

		update: (inObj) => new Promise((resolve, reject) => {

			// An update is straighforward unless the test level is updated
			if (_.isUndefined(inObj.testLevelId || _.isNull(inObj.testLevelId))) {
				return util.updateHash(inObj, referenceObj, endpointName);
			} else {
				return util.getHash(inObj)
					.then(obj => util.getHash(`test-level:${obj.testLevelId}`)
						.then(levelObj => r.srem(`plan-level:${obj.parentId}:${levelObj.level}`, obj.id))
						.then(() => r.sadd(`plan-level:${obj.parentId}:${inObj.level}`, obj.id))
						.catch(reject))
					.then(() => util.updateHash(inObj, referenceObj, endpointName))
					.then(resolve)
					.catch(reject)
			}
		}),

		delete: (inObj) =>

			util.getHash(inObj)

				// No longer available for (source/target/level) testing
				.then(obj => { testObj = _.assign(obj); return util.getHash(`test-level:${obj.testLevelId}`); })
				.then(levelObj => r.srem(`plan-level:${testObj.parentId}:${levelObj.level}`, inObj.id))

				// Delete corresponding questions as well
				.then(() => r.smembers(`test:{inObj.id}:question}`))
				.then(ids => Promise.all(ids.map(id => child.delete(id))))

				// Don't need the set 'test:<testId>:question' anymore
				.then(() => r.del(`test:{inObj.id}:question}`))

				// Finally delete the object itself
				.then(() => util.deleteHash(inObj, endpointName))
	}

	module.exports = test;

})();