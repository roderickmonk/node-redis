'use strict';

(function () {

	const
		util = require('./util'),
		child = require('./answer'),
		referenceObj = {
			id: false,
			parentId: true,
			source: true
		},
		endpointName = 'question',
		parent = 'test';

	const question = {

		name: () => endpointName,

		create: (inObj) => util.createHashWithParent(inObj, referenceObj, endpointName, parent),

		get: (inObj) => util.getHash(inObj, endpointName),

		update: (inObj) => util.updateHash(inObj, referenceObj, endpointName, parent),

		delete: (inObj) => 

			util.getHash(inObj)

				// Begin by deleting child objects
				.then(() => r.smembers(`question:{inObj.id}:answer}`))
				.then(ids => Promise.all(ids.map(id => child.delete(id))))

				// Don't need the set any more either
				.then(() => r.del(`question:{inObj.id}:answer}`))

				// Finally delete the object itself
				.then(() => util.deleteHash(inObj, endpointName))

	}

	module.exports = question;

})();