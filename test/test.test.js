'use strict';

const
	endpoint = require('../test'),
	testLevel = require('../test-level'),
	language = require('../language'),
	testPlan = require('../test-plan');
	
describe(`/${endpoint.name()}/`, () => {

	const createObject = {
		id: undefined,
		created: 1000,
		authorId: 123,
		parentId: undefined,
		testLevelId: undefined,
		minCorrect: 4,
		maxRetries: 3,
		description: "description"
	}
	const updateObj = { newMaxRetries: 15 };

	let levelIds = [];
	let languageId1, languageId2, languageId3, languageId4;
	let plan = {};

	before(() =>
		// Create some test levels and languages
		testLevel.get()
			// Get the pre-existing levels
			.then(levels => {
				for (let i = 0; i < levels.length; ++i) {
					levelIds.push(levels[i].id);
				}
				return language.create({ name: "11111111", description: "some description" });
			})
			.then(languageObj => {
				languageId1 = languageObj.id;
				return language.create({ name: "22222222", description: "some description" });
			})
			.then(languageObj => {
				languageId2 = languageObj.id;
				return language.create({ name: "33333333", description: "some description" });
			})
			.then(languageObj => {
				languageId3 = languageObj.id;
				return language.create({ name: "44444444", description: "some description" });
			})
			.then(languageObj => {
				languageId4 = languageObj.id;
				return testPlan.create({ sourceId: languageId1, targetId: languageId2, levels: 4, maxRetries: 3 });
			})
			.then(testPlanObj => { plan = _.assign(testPlanObj); }));

	it('Create And Get', () =>
		utilTest.createAndGet(
			_.merge(createObject, { testLevelId: levelIds[0], parentId: plan.id }),
			_.merge(createObject, { testLevelId: levelIds[0], parentId: plan.id }),
			endpoint));

	it('Create 1000 Objects', () => utilTest.create1000Objects(
		_.merge(createObject, { testLevelId: levelIds[0], parentId: plan.id }), endpoint));

	it('Count Objects', () => utilTest.countObjects(endpoint, 1002));

	it('Update All', () => utilTest.updateAll(endpoint, updateObj));

	it('Delete Known Object', () => utilTest.deleteKnownObject(endpoint));

	it('Delete Unknown Object', () => utilTest.deleteUnknownObject(endpoint));

});
