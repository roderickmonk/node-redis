'use strict';

const util = require('./util');

(function () {

	const
		language = require('./language'),
		testLevel = require('./test-level'),
		evaluation = require('./evaluation'),
		testPlan = require('./test-plan'),
		test = require('./test'),
		question = require('./question'),
		answer = require('./answer'),
		testResult = require('./test-result'),
		successfulCandidate = require('./successful-candidate'),

		translatorApi = {

			'/language/': (req, res) => {

				if (req.method === 'POST') {
					language.create(req._post)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'GET') {
					language.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'PUT') {
					language.create(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'DELETE') {
					language.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			},

			'/test-level/': (req, res) => {

				if (req.method === 'POST') {
					testLevel.create(req._post)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'GET') {
					testLevel.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'PUT') {
					testLevel.create(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'DELETE') {
					testLevel.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			},

			'/test-plan/': (req, res) => {

				if (req.method === 'POST') {
					testPlan.create(req._post)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'GET') {
					testPlan.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'PUT') {
					testPlan.create(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'DELETE') {
					testPlan.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			},

			'/test-plan/complete/': (req, res) => {

				// Get Test Plans for those (source/target)'s that are complete,
				// that is, have 1 or more Tests at each level.
				if (req.method === 'GET') {
					testPlan.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			},

			'/test/': (req, res) => {

				if (req.method === 'POST') {
					test.create(req._post)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'GET') {
					test.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'PUT') {
					test.create(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'DELETE') {
					test.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			},

			'/question/': (req, res) => {

				if (req.method === 'POST') {
					question.create(req._post)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'GET') {
					question.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'PUT') {
					question.create(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'DELETE') {
					question.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			},

			'/answer/': (req, res) => {

				if (req.method === 'POST') {
					answer.create(req._post)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'GET') {
					answer.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'PUT') {
					answer.create(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'DELETE') {
					answer.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			},

			'/evaluation/': (req, res) => {

				if (req.method === 'POST') {
					evaluation.create(req._post)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'GET') {
					evaluation.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'PUT') {
					evaluation.create(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else if (req.method === 'DELETE') {
					evaluation.get(req._query)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			},

			'/test-result/': (req, res) => {

				if (req.method === 'POST') {
					testResult.create(req._post)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			},

			'/successful-candidate/': (req, res) => {

				if (req.method === 'GET') {
					successfulCandidate.get(req._post)
						.then(result => res.reply.json(result))
						.catch(err => util.errorResponse(err, res));
				} else res.reply.code(503)
			}
		}

	module.exports = translatorApi;
})();

