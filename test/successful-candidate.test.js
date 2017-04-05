'use strict';

const
	endpoint = require('../successful-candidate');
	
describe(`/${endpoint.name()}/`, () => {

	const
		obj1 = {
			testeeId: 123,
			testId: undefined,
			result: 4
		},
		obj2 = {
			testeeId: 123,
			testId: undefined,
			result: 5
		};

	let testId;

	before(() =>
		// Reuse the tests that have already been created
		r.srandmember('test-ids')
			.then(id => testId = id));

	it('Get Successful Candidates', () => endpoint.get());

});
