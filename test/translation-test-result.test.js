'use strict';

const
	endpoint = require('../translation-test-result');

describe(`/${endpoint.name()}/`, () => {

	const
		createObject1 = {
			testeeId: 42,
			target: "Some target text"
		},

		createObject2 = {
			testeeId: 42,
			target: "Some other target text"
		},

		updateObj = { target: "Some new target text" };

	let translationTestId;

	before(() =>
		// Need a translationTestId
		r.srandmember('translation-test-ids')
			.then(id => translationTestId = id));

	it('Create And Get', () => utilTest.createAndGet(
		_.merge({}, createObject1, { translationTestId: translationTestId }),
		_.merge({}, createObject2, { translationTestId: translationTestId }),
		endpoint));

	it('Create 1000 Objects', () => utilTest.create1000Objects(
		_.merge({}, createObject1, { translationTestId: translationTestId }), endpoint));

	it('Count Objects', () => utilTest.countObjects(endpoint, 1002));

	it('Update All', () => utilTest.updateAll(endpoint, endpoint.name(), updateObj));

	it('Delete Known Object', () => utilTest.deleteKnownObject(endpoint));

	it('Delete Unknown Object', () => utilTest.deleteUnknownObject(endpoint));

});
