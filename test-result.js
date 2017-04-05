'use strict';


(function () {

	const
		util = require('./util'),
		endpointName = 'test-result',
		referenceObj = {
			id: false,
			testeeId: true,
			testId: true,
			answers: true
		};

	const testResult = {

		name: () => endpointName,

		create: (inObj) => new Promise((resolve, reject) =>

			util.verifyRequiredProperties(inObj, referenceObj)

				// Need to know about the test
				.then(() => r.hgetall(`test:${inObj.testId}`))

				// Count down the number of correct answers
				.then(testObj =>

					Promise.all(inObj.answers.map(answer => r.hget(`answer:${answer.id}`, 'isCorrect')))
						.then(corrects => {

							const countDown = corrects.reduce((val, correct) => {
								if (correct)--val;
								return val;
							}, testObj.minCorrect);

							// Record whether passed
							return r.hmset(`test-result:${testObj.parentId}:${testObj.testLevelId}`,
								{ testedId: inObj.testeeId, timestamp: moment(), passed: countDown <= 0 });
						})
						.catch(reject))
				.then(resolve, reject))
	}

	module.exports = testResult;
})();
