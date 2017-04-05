'use strict';

(function () {

	const
		util = require('./util'),
		referenceObj = {
			id: false,
			parentId: true,
			isCorrect: true,
			target: true
		},
		endpointName = 'answer',
		parent = 'question',

		answer = {

			name: () => endpointName,

			create: (inObj) => util.createHashWithParent(inObj, referenceObj, endpointName, parent),

			get: (inObj) => util.getHash(inObj, endpointName),

			update: (inObj) => util.updateHash(inObj, referenceObj, endpointName, parent),

			delete: (inObj) => util.deleteHash(inObj, endpointName)
		}

	module.exports = answer;

})();