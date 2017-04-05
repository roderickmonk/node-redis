'use strict';

const
	endpoint = require('../language');

describe(`/${endpoint.name()}/`, () => {

	let objectId;

	const
		createObj = {
			id: undefined,
			name: undefined,
			description: 'description'
		},
		updateObj = { description: "new description" };

	// Clear the database
	before(() => r.flushall());

	it('Create And Get', () =>

		utilTest.createAndGet(
			_.merge({}, createObj, { name: "Russian" }), _.merge({}, createObj, { name: "Spanish" }), endpoint));

	it('Duplicate Language Check', () => new Promise((resolve, reject) =>

		endpoint.create({ name: "Russian", description: "description" })
			.then(() => reject(new Error('Inserted Duplicate Object')))
			.catch(() => resolve())));

	it('Create 1000 Objects', () =>

		Promise.all(Array.from(Array(1000).keys()).map(() =>
			// Give each a random name
			endpoint.create({ name: ("" + Math.random()), description: "some description" })
				.then((object => object.should.have.properties(['id', 'name', 'description']))))));

	it('Count Objects', () => utilTest.countObjects(endpoint, 1002));

	it('Update All', () => utilTest.updateAll(endpoint, updateObj));

	it('Delete Known Object', () => utilTest.deleteKnownObject(endpoint));

	it('Delete Unknown Object', () => utilTest.deleteUnknownObject(endpoint));

	it('Update All Names', () =>
		r.smembers(`${endpoint.name()}-ids`)
			.then(ids => Promise.all(ids.map(id => endpoint.update({ id: id, name: ("" + Math.random()) }))))
			.then(() => r.smembers(`${endpoint.name()}-ids`))
			.then(ids => Promise.all(ids.map(id => r.hgetall(`${endpoint.name()}:${id}`)))));
});
