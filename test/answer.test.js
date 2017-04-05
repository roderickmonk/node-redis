'use strict';

const
	endpoint = require('../answer'),
	testLevel = require('../test-level'),
	language = require('../language'),
	test = require('../test'),
	question = require('../question');

describe(`/${endpoint.name()}/`, () => {

	let tests = [];

	let questionId;

	const
		createObj = {
			id: undefined,
			parentId: undefined,
			isCorrect: true,
			target: "target text"
		},
		updateObj = { target: "new text" };

	before(() => new Promise((resolve, reject) =>
		// Reuse the tests that have already been created
		test.get()
			.then(objs => {
				if (objs.length >= 1) {
					tests = _.assign(objs);
				} else {
					reject(new Error('No Tests Available'));
				}
			})
			.then(() => question.create({ parentId: tests[0].id, source: "source question" }))
			.then(question => { questionId = question.id; resolve(); })));

	it('Create And Get', () =>

		utilTest.createAndGet(
			_.merge({}, createObj, { parentId: questionId }), _.merge({}, createObj, { parentId: questionId }), endpoint));

	it('Create 1000 Objects', () => utilTest.create1000Objects(_.merge(createObj, { parentId: questionId }), endpoint));

	it('Count Objects', () => utilTest.countObjects(endpoint, 1002));

	it('Update All', () => utilTest.updateAll(endpoint, updateObj));

	it('Delete Known Object', () => utilTest.deleteKnownObject(endpoint));

	it('Delete Unknown Object', () => utilTest.deleteUnknownObject(endpoint));

});
