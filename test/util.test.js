'use strict';

(function () {

	const utilTest = {


		createAndGet: (inObj1, inObj2, endpoint, expect) => new Promise((resolve, reject) => {

			if (_.isUndefined(expect)) expect = 2;

			endpoint.create(inObj1)

				.then(object => {

					if (_.isEqual(Object.keys(object, Object.keys(inObj1)))) {
						reject(new Error('Unexpected Object Properties'));
					}

					// Ensure it was saved properly
					return r.hgetall(`${endpoint.name()}:${object.id}`)
						.then(object => {
							if (_.isEqual(Object.keys(object, Object.keys(inObj1)))) {
								reject(new Error('Unexpected Object Properties'));
							}
						})
						.catch(reject);
				})
				.then(() => endpoint.create(inObj2))

				// Retrieve and validate a single object
				.then(() => r.srandmember(`${endpoint.name()}-ids`)
					.then(id => endpoint.get({ id: id }))
					.then(objects => {
						if (objects.length != 1) {
							reject(new Error(`Exactly One ${endpoint.name()} Object Expected`));
						} else {
							if (_.isEqual(Object.keys(objects[0], Object.keys(inObj1)))) {
								reject(new Error('Unexpected Object Properties'));
							}
						}
					}))

				// Next get everything
				.then(() => endpoint.get())
				.then(objects => {
					objects.length >= expect ? resolve() : reject(new Error(`Minimum ${endpoint.name()} Objects Expected, ${objects.length} Detected`));
				})
				.catch(err => reject(err))
		}),

		create1000Objects: (inObj, endpoint) => new Promise((resolve, reject) =>

			Promise.all(Array.from(Array(1000).keys()).map(() => endpoint.create(inObj)
				.then(object => {
					if (_.isEqual(Object.keys(object, Object.keys(inObj)))) {
						reject(new Error('Unexpected Object Properties'));
					}
				})))
				.then(resolve)
				.catch(reject)),

		countObjects: (endpoint, expectedCount) => new Promise((resolve, reject) => {

			endpoint.get()
				.then(objects => {
					if (objects.length < expectedCount) {
						reject(new Error(`Actual Count: ${objects.length}, Expected: ${expectedCount}`))
					}
					else {
						// Ensure the number of ids is the same
						r.scard(`${endpoint.name()}-ids`)
							.then(count => {
								if (objects.length < expectedCount) {
									reject(new Error(`Actual Id Count: ${count}, Minimum Expected: ${expectedCount}`))
								} else {
									resolve();
								}
							})
							.catch(reject);
					}
				})
				.catch(reject);
		}),

		updateAll: (endpoint, fieldUpdate) => new Promise((resolve, reject) => {

			const fieldUpdateKey = Object.keys(fieldUpdate)[0];
			const fieldUpdateValue = fieldUpdate[fieldUpdateKey];

			r.smembers(`${endpoint.name()}-ids`)
				.then(ids => Promise.all(ids.map(id => endpoint.update(_.merge({ id: id }, fieldUpdate)).then(_.noop).catch(reject))))
				.then(() => r.smembers(`${endpoint.name()}-ids`))
				.then(ids => Promise.all(ids.map(id => r.hgetall(`${endpoint.name()}:${id}`))))
				.then(objects => {
					for (let i = 0; i < objects.length; ++i) {
						if (objects[i][fieldUpdateKey] != fieldUpdateValue) {
							reject(new Error('Update Failed'));
						}
					}
					resolve();
				})
				.catch(reject);
		}),

		update404: (endpoint, fieldUpdate) => new Promise((resolve, reject) => {

			const fieldUpdateKey = Object.keys(fieldUpdate)[0];
			const fieldUpdateValue = fieldUpdate[fieldUpdateKey];

			r.smembers(`${endpoint.name()}-ids`)
				.then(ids => Promise.all(ids.map(id => endpoint.update(_.merge({ id: id }, fieldUpdate)).then(_.noop).catch(reject))))
				.then(() => r.smembers(`${endpoint.name()}-ids`))
				.then(ids => Promise.all(ids.map(id => r.hgetall(`${endpoint.name()}:${id}`))))
				.then(objects => {
					for (let i = 0; i < objects.length; ++i) {
						if (objects[i][fieldUpdateKey] != fieldUpdateValue) {
							reject(new Error('Update Failed'));
						}
					}
					resolve();
				})
				.catch(reject);
		}),

		deleteKnownObject: (endpoint) => new Promise((resolve, reject) => {

			r.srandmember(`${endpoint.name()}-ids`)
				.then(id => {
					endpoint.delete({ id: id })
						.then(() => {
							// Now try to re-delete it
							endpoint.delete({ id: id })
								.then(() => reject(new Error('Deleted a Deleted Object!!')))
								.catch(resolve);
						})
						.catch(reject);
				})
				.then(resolve)
				.catch(reject);
		}),

		deleteUnknownObject: (endpoint) => new Promise((resolve, reject) => {

			endpoint.delete({ id: 10000000 })
				.then(() => reject(new Error('Deleted an Unknown Object')))
				.catch(err => {
					if (err instanceof ApiError && err.code == 404) {
						resolve();
					} else {
						reject(new Error('404 Expected'));
					}
				});
		})
	}
	module.exports = utilTest;
})();
