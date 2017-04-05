'use strict';

const
	endpoint = require('../test-result'),
	testLevel = require('../test-level'),
	language = require('../language'),
	testPlan = require('../test-plan'),
	test = require('../test'),
	answer = require('../answer'),
	question = require('../question');

describe(`/${endpoint.name()}/`, () => {

	let testPlanId, testId, questionId, answerIds = [], languages = [], levelId0, testObj = {};

	before(() =>

		testLevel.getId(0)
			.then(id => {
				levelId0 = id;
				return Promise.all([0, 1].map(() => language.create({ name: "" + Math.random() })));
			})
			.then(languageObjs => {
				languages = _.assign(languageObjs);
				return testPlan.create({ sourceId: languages[0].id, targetId: languages[1].id, levels: 1 });
			})
			// Create a test, a question, and then a number of answers
			.then(testPlanObj => {
				testPlanId = testPlanObj.id;
				return test.create({
					authorId: 123,
					parentId: testPlanId,
					testLevelId: levelId0,
					minCorrect: 3,
					maxRetries: 10
				});
			})
			.then(obj => {
				testObj = _.assign(obj);
				testId = testObj.id;
				return question.create({ parentId: testId, source: "from text" });
			})
			.then(questionObj => {
				questionId = questionObj.id;
				return answer.create({ parentId: questionId, isCorrect: true, target: "to text" });
			})
			.then(answerObj => {
				answerIds.push(answerObj);
				return answer.create({ parentId: questionId, isCorrect: true, target: "to text" });
			})
			.then(answerObj => {
				answerIds.push(answerObj);
				return answer.create({ parentId: questionId, isCorrect: true, target: "to text" });
			})
			.then(answerObj => {
				answerIds.push(answerObj);
				return answer.create({ parentId: questionId, isCorrect: true, target: "to text" });
			})
			.then(answerObj => {
				answerIds.push(answerObj);
				return answer.create({ parentId: questionId, isCorrect: true, target: "to text" });
			})
			.then(answerObj => {
				answerIds.push(answerObj);
			}));

	it('Create Test Result', () => new Promise((resolve, reject) =>
		endpoint.create({ testeeId: 123, testId: testId, answers: answerIds })
			.then(() => r.hgetall(`test-result:${testObj.parentId}:${testObj.testLevelId}`))
			.then(testResult => {
				if (_.isEmpty(testResult) || _.isUndefined(testResult.passed)) {
					reject(new Error('Test Result Not Recorded'));
				}
				else if (!testResult.passed) {
					reject(new Error('Test Result Recorded Incorrectly'));
				} else resolve();
			})
			.catch(reject)))
});
