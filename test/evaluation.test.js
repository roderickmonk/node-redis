'use strict';

const
	endpoint = require('../evaluation'),
	updateObj = { ranking: 100 };

describe(`/${endpoint.name()}/`, () => {

	const createObject1 = {
		created: 123,
		testerId: 42,
		testeeId: 43,
		sourceId: 123,
		targetId: 124,
		ranking: 90,
		comment: 'Excellent'
	};

	const createObject2 = {
		created: 123,
		testerId: 42,
		testeeId: 43,
		sourceId: 123,
		targetId: 124,
		ranking: 60,
		comment: 'Average'
	};

	const updateObj = { comment: "super evaluation" };

	it('Create And Get', () => utilTest.createAndGet(createObject1, createObject2, endpoint));

	it('Create 1000 Objects', () => utilTest.create1000Objects(createObject1, endpoint));

	it('Count Objects', () => utilTest.countObjects(endpoint, 1002));

	it('Update All', () => utilTest.updateAll(endpoint, endpoint.name(), updateObj));

	it('Delete Known Object', () => utilTest.deleteKnownObject(endpoint));

	it('Delete Unknown Object', () => utilTest.deleteUnknownObject(endpoint));

});
