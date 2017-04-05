'use strict';

//require(process.env.HOME + '/modules/global')({ test: true });

const
	_ = require('lodash'),
	redis = require("ioredis"),
	r = redis.createClient();

const ApiError = require('./api-error');

(function () {

	var util = {

		addSetMember: (key, member) => new Promise((resolve, reject) => {

			r.sismember(key, member)
				.then(isMember => {
					if (isMember) {
						reject(new ApiError('Already Exists', 400));
					}
					else {
						r.sadd(key, member)
							.then(resolve)
							.catch(reject);
					}
				})
				.catch(reject);
		}),

		hashExists: (hash, assertLevel) => new Promise((resolve, reject) =>

			r.exists(hash)
				.then(exists => {
					if (exists === 0) {
						if (assertLevel === true) {
							reject(new ApiError('Hash Not Found'));
						} else {
							resolve();
						}
					} else {
						if (assertLevel === false) {
							reject(new ApiError('Already Exists'));
						} else {
							resolve();
						}
					}
				})
				.catch(reject)),

		addId: (key, id) => new Promise((resolve, reject) =>

			r.sadd(key, id)
				.then(() => resolve(id))
				.catch(reject)),

		removeId: (key, id) => new Promise((resolve, reject) =>
			r.srem(key, id)
				.then(result => {
					if (result === 0) { // There was nothing to delete
						reject(new ApiError('Not Found'));
					}
					else {
						resolve(id);
					}
				})
				.catch(reject)),

		isIdKnown: (key, id) => new Promise((resolve, reject) =>

			r.sismember(key, id)
				.then(isKnown => {
					if (isKnown) {
						resolve();
					} else {
						reject(new ApiError(`${key} ${id} Unknown`));
					}
				})
				.catch(reject)),

		paramExists: (param) => new Promise((resolve, reject) => {
			if (typeof param != 'undefined' && param) {
				resolve();
			} else {
				reject(new ApiError('Missing Parameter'));
			}
		}),

		verifyRequiredProperties: (inObj, requiredObj) => new Promise((resolve, reject) => {
			Object.keys(requiredObj).forEach(key => {
				if (requiredObj[key] && (typeof inObj[key] == 'undefined' || _.isNull(!inObj[key]))) {
					reject(new ApiError(`Required Parameter '${key}' Missing`), 400);
				}
			});
			resolve();
		}),

		addHash: (hash, id, obj) => new Promise((resolve, reject) => {

			// Include the id name in the hash
			obj.id = id;

			return r.hmset(`${hash}:${id}`, obj)
				.then(() => resolve(id))
				.catch(reject);
		}),

		getHashField: (id, field) => new Promise((resolve, reject) =>

			r.hget(`language:${id}`, field)
				.then(result => {
					if (result) {
						resolve(result);
					} else {
						reject(new ApiError('Not Found', 404));
					}
				})
				.catch(reject)),

		createHash: (inObj, templateObj, endpointName) => new Promise((resolve, reject) => {

			// Filter incoming properties
			for (let key in templateObj) if (_.isUndefined(inObj[key])) delete inObj[key];

			return util.verifyRequiredProperties(inObj, templateObj)

				.then(() => r.incr('auto-id'))

				// Keep track of ids
				.then(id => util.addId(`${endpointName}-ids`, id))

				.then(id => util.addHash(endpointName, id, inObj))

				.then(id => { inObj.id = id; resolve(inObj); })
				.catch(reject)
		}),

		createHashWithParent: (inObj, referenceObj, endpointName, parent) => new Promise((resolve, reject) => {

			// Filter incoming properties
			Object.keys(referenceObj).forEach(key => { if (_.isUndefined(inObj[key])) delete inObj[key]; });

			return util.verifyRequiredProperties(inObj, referenceObj)

				// Ensure that the parent id is known
				.then(() => util.isIdKnown(`${parent}-ids`, inObj.parentId))

				// Keep track of ids
				.then(() => r.incr('auto-id'))
				.then(id => util.addId(`${endpointName}-ids`, id))

				.then(id => util.addHash(`${endpointName}`, id, inObj))
				.then(id => {

					// Associate the parent with this record
					inObj.id = id;
					r.sadd(`${parent}:${inObj.parentId}:${endpointName}`, id)
						.then(() => resolve(inObj))
						.catch(reject);
				})
				.catch(reject);
		}),

		getHash: (inObj, endpointName) => new Promise((resolve, reject) => {

			if (_.isUndefined(inObj) || _.isUndefined(inObj.id)) {
				return r.smembers(`${endpointName}-ids`)
					.then(ids => Promise.all(ids.map(id => r.hgetall(`${endpointName}:${id}`))))
					.then(resolve)
					.catch(reject)
			} else {
				return r.hgetall(`${endpointName}:${inObj.id}`)
					.then(object => resolve([object]))
					.catch(reject)
			}
		}),

		updateHash: (inObj, templateObj, child, parent) => new Promise((resolve, reject) => {

			// Clean properties
			for (let key in templateObj) if (_.isUndefined(inObj[key])) delete inObj[key];

			if (_.isUndefined(parent)) {

				// Merge old with new 
				return util.paramExists(inObj.id)
					.then(() => r.hgetall(`${child}:${inObj.id}`))
					.then(currentObj => {
						const newObj = _.merge(currentObj, inObj);
						return r.hmset(`${child}:${inObj.id}`, newObj)
							.then(() => resolve(newObj))
							.catch(reject);
					})
					.catch(reject);
			} else {

				return util.paramExists(inObj.id)

					// Merge with current
					.then(() => r.hgetall(`${child}:${inObj.id}`))
					.then(currentObj => {

						const newObj = _.merge(currentObj, inObj);

						// Ensure that the parent id is known
						return util.isIdKnown(`${parent}-ids`, newObj.parentId)
							.then(() => r.hmset(`${child}:${inObj.id}`, newObj))
							.then(() => resolve(newObj))
							.catch(reject);
					})
					.catch(reject);
			}
		}),

		deleteHash: (inObj, endpointName, parent) => new Promise((resolve, reject) => {

			if (_.isUndefined(parent)) {
				return util.paramExists(inObj.id)

					// Remove the hash
					.then(() => r.del(`${endpointName}:${inObj.id}`))

					.then(count => {
						if (count === 0) {
							reject(new ApiError('Not Found', 404));
						}
						else {
							// Remove the id reference
							return util.removeId(`${endpointName}-ids`, inObj.id)
								.catch(reject);
						}
					})
					.then(resolve)
					.catch(reject)

			} else {

				let parentId;

				return util.paramExists(inObj.id)

					// Get the complete hash, as the parent id is needed
					.then(() => r.hgetall(`${child}:${inObj.id}`))

					// Remove the hash
					.then(obj => {
						if (_.isEmpty(obj)) {
							reject(new ApiError('Not Found', 404));
						} else {
							parentId = obj.parentId;
							return r.del(`${child}:${inObj.id}`)
								.then(_.noop)
								.catch(reject);
						}
					})

					// Remove the id reference
					.then(() => util.removeId(`${child}-ids`, inObj.id))

					// Remove the association with the parent
					.then(() => util.removeId(`${parent}:${parentId}`, inObj.id))

					.then(resolve)
					.catch(reject);
			}
		}),

		errorResponse: (err, res) => {

			if (typeof err === "string") {
				return res.reply.code(503, { 'content-type': 'text/plain' }, err);
			} else if (_.isObject(err)) {
				if (err instanceof ApiError) {
					return res.reply.code(err.code, { 'content-type': 'application/json' }, json.stringify({ error: err }));
				} else {
					return res.reply.code(503, { 'content-type': 'application/json' }, json.stringify({ error: err }));
				}
			}
			res.reply.code(503, { 'content-type': 'text/plain' }, "Unspecified Error");
		},

		updateCompleteTestPlans: () => new Promise((resolve, reject) =>
			r.del('complete-test-plans')
				.then(() => util.getHash({}, 'test-plan'))
				.then(testPlans => Promise.all(testPlans.map(testPlan =>
					Promise.all(Array.from({ length: testPlan.levels }, (v, i) => i).map(level => r.scard(`plan-level:${testPlan.id}:${level}`)))
						.then(counts => {
							return {
								id: testPlan.id,
								// If all counts are > 0, then the plan is complete
								complete: counts.reduce((value, count) => {
									value = value && (count > 0);
									return value;
								}, true)
							}
						}))))
				.then(results => new Promise(resolve => resolve(
					// Filter out Test Plans that are incomplete
					Object.keys(_.pickBy(results.reduce((ids, result) => {
						if (result.id in ids) {
							ids.complete = result.complete;
						} else {
							ids[result.id] = result.complete;
						}
						return ids;
					}, {}),
						value => value)))
				))
				.then(completePlanIds => {
					//console.log('completePlanIds: ', completePlanIds);
					if (completePlanIds.length) {
						r.sadd('complete-test-plans', completePlanIds);
					}
					resolve();
				})
				.catch(reject)),

		getCompleteTestPlans: () =>

			util.updateCompleteTestPlans()
				.then(() => r.smembers('complete-test-plans'))
				.then(testPlanIds => Promise.all(testPlanIds.map(id => r.hgetall(`test-plan:${id}`))))
	}

	module.exports = util;

})();