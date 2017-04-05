'use strict';

(function () {

	const
		util = require('./util'),
		endpointName = 'successful-candidate'

	const successfulCandidate = {

		name: () => endpointName,

		// Get all candidates who have completed all levels
		get: () =>

			util.getCompleteTestPlans()

				// For each plan, find testees that have completed all levels
				.then(testPlans =>
					testPlans.map(testPlan =>
						Promise.all(Array.from(Array(testPlan.levels).keys()).map(level =>
							r.hgetall(`test-results:${testPlan.id}:${level}`)))))
	}
	
	module.exports = successfulCandidate;

})();
