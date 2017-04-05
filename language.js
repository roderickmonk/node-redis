'use strict';
	
(function () {

	const
		util = require('./util'),
		
		templateObj = {
			id: undefined,
			name: undefined,
			description: undefined
		},
		endpointName = 'language';

	var language = {

		name: () => endpointName,

		create: (inObj) => new Promise((resolve, reject) => {

			// Clean properties
			for (let key in templateObj) if (_.isUndefined(inObj[key])) delete inObj[key];

			return util.paramExists(inObj.name)

				// Ensure unique names
				.then(() => util.addSetMember(endpointName, inObj.name.toLowerCase()))

				// Need a unique id
				.then(() => r.incr('auto-id'))

				// Keep track of ids
				.then(id => util.addId(`${endpointName}-ids`, id))

				// Record the new record
				.then(id => util.addHash(endpointName, id, inObj))

				// Copy the object back to the client
				.then(id => { inObj.id = id; resolve(inObj); })
				.catch(reject);
		}),

		get: (inObj) => util.getHash(inObj, endpointName),

		update: (inObj) => util.updateHash(inObj, templateObj, endpointName),

		delete: (inObj) => new Promise((resolve, reject) =>

			r.hget('language-use', `${inObj.id}`)

				// Can't delete a language if it is in use
				.then(count => {
					if (_.isNull(count) || count <= 0) {
						util.deleteHash(inObj, endpointName)
							.then(resolve, reject);
					}
					else {
						reject(new ApiError('Language In Use'));
					}
				})
				.catch(reject))
	}

	module.exports = language;

})();