'use strict';

const
	endpoint = require('../question'),
	test = require('../test');
	
describe(`/${endpoint.name()}/`, () => {

	let tests = [];

	const createObject = {
		id: undefined,
		parentId: undefined,
		source: "source text"
	}

	const updateObj = { source: "new text" };

	before(() => new Promise((resolve, reject) =>
		// Reuse the tests that have already been created
		test.get()
			.then(objs => {
				if (objs.length >= 1) {
					tests = _.assign(objs);
					resolve();
				} else {
					reject(new Error('No Tests Available'));
				}
			})));

	it('Create And Get', () =>

		utilTest.createAndGet(
			_.merge(createObject, { parentId: tests[0].id }),
			_.merge(createObject, { parentId: tests[0].id }),
			endpoint));

	it('Create 1000 Objects', () => utilTest.create1000Objects(_.merge(createObject, { parentId: tests[0].id }), endpoint));

	it('Count Objects', () => utilTest.countObjects(endpoint, 1002));

	it('Update All', () => utilTest.updateAll(endpoint, updateObj));

	it('Delete Known Object', () => utilTest.deleteKnownObject(endpoint));

	it('Delete Unknown Object', () => utilTest.deleteUnknownObject(endpoint));

});
