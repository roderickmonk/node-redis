'use strict';

const
	endpoint = require('../test-level');

describe(`/${endpoint.name()}/`, () => {

	const
		Level0 = {
			id: null,
			level: 0,
			name: "Level 0",
			description: "original description"
		},
		Level1 = {
			id: null,
			level: 1,
			name: "Level 1",
			description: "original description"
		},
		Level2 = {
			id: null,
			level: 2,
			name: "Level 2",
			description: "original description"
		},
		Level3 = {
			id: null,
			level: 3,
			name: "Level 3",
			description: "original description"
		},
		updateObj = { description: "new description" };

	it('Create & Get Level 0 and Level 1', () => utilTest.createAndGet(Level0, Level1, endpoint, 2));

	it('Create & Get Level 2 and Level 3', () => utilTest.createAndGet(Level2, Level3, endpoint, 4));

	it('Duplicate Level Check', () => new Promise((resolve, reject) =>

		endpoint.create(Level0)
			.then(() => reject(new Error('Duplicate')))
			.catch(err => {
				if (err instanceof ApiError && err.code == 400) {
					resolve();
				} else {
					reject(new Error(`Unexpected Error: ${err}`));
				}
			})));

	it('Update All', () => utilTest.updateAll(endpoint, endpoint.name(), updateObj));

});
