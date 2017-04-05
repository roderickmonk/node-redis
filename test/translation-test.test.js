'use strict';

const
	endpoint = require('../translation-test');

describe(`/${endpoint.name()}/`, () => {

	const
		createObject1 = {
			authorId: 42,
			source: "Some source text"
		},

		createObject2 = {
			authorId: 42,
			source: "Some other source text"
		},

		updateObj = { source: "Some new source" };

	let sourceId, targetId;

	before(() =>
		// Need a couple of language Ids
		r.srandmember('language-ids')
			.then(id => { sourceId = id; return r.srandmember('language-ids'); })
			.then(id => targetId = id));

	it('Create And Get', () => utilTest.createAndGet(
		_.merge({}, createObject1, { sourceId: sourceId, targetId: targetId }),
		_.merge({}, createObject2, { sourceId: sourceId, targetId: targetId }),
		endpoint));

	it('Create 1000 Objects', () => utilTest.create1000Objects(
		_.merge({}, createObject1, { sourceId: sourceId, targetId: targetId }), endpoint));

	it('Count Objects', () => utilTest.countObjects(endpoint, 1002));

	it('Update All', () => utilTest.updateAll(endpoint, endpoint.name(), updateObj));

	it('Delete Known Object', () => utilTest.deleteKnownObject(endpoint));

	it('Delete Unknown Object', () => utilTest.deleteUnknownObject(endpoint));

});
