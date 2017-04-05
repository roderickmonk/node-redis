# Redis API Concept
The following discussion presents the overall API concept, starting from the more fundamental endpoints, and then advancing through to the more complex.  Redis is the database platform.

## Purpose
<ul>
<li>To allow front-end software to compose translation tests which are ultimately presented to potential candidate translators.</li>
<li>To allow front-end software to retrieve tests to be presented to candidate translators.</li>
<li>To allow front-end software to submit test results.</li>
<li>To allow front-end software to submit evaluations of translator ability.</li>
<li>To allow front-end software to retrieve the current set of translators who have passed all self-administered tests at all test levels (for a given source / target translation).</li>
</ul>

## Scope
Although it is assumed that API end-point processing will begin by confirming the user’s authorization to carry out whatever is required of the end-point, authorization is outside of the scope of this software.

## Open Issues
It would be advantageous if the /successful-candidates/ endpoint provided a query parameter to allow the user to specify: ‘since when?’.  This would allow the user to filter on only those candidates that have just recently completed self-administered testing.

# Endpoints
## /language/
As one would expect, it is necessary to have a concept of language – in this case a name and description.  Appropriate steps are taken to ensure that language names are not duplicated.
## /test-level/
The essential property of a test level is, indeed, the level, with a lowest possible value being 0.  A descriptive field is provided as well.  There can only be one test level record per level.
## /evaluation/
Once a candidate tester has completed self-administered testing (for a given source / target translation), the API provides the /evaluation/ endpoint to allow an manager role to provide further evaluations as required.
## /test-plan/
This endpoint supports a testing framework that begins with the creation of a Test Plan.  A Test Plan’s most significant properties are the (source / target) languages and the number of self-managed test levels (note: the number of levels can vary from one (source / target) to the next).
## /test-plan/complete/
This endpoint returns details of all Test Plans that are complete.  Complete in this context means that there exists at least one Test for each level, where ‘levels’ is a Test Plan field.  
Test Plans under construction are not returned by this endpoint.
## /test/
The /test/ endpoint provides the usual CRUD support for ‘test’ records.  A test is specific to a single (source/target/level).  Note the property minCorrect: It allows the creator of a Test to specify the minimum number of questions that must be answered correctly in order to pass the test.  
A particular feature of the system is that it is possible to define any number of Tests for a particular (source/target/level).
## /test/conduct/
At the point where the user wishes to carry out a specific test, a request is made to retrieve all the salient details for a specific test (that is, both questions and answers).
## /question/
Associated with each Test there will be a number of Question records.  The Question record always provides the source text to be translated.
## /answer/
Associated with each Question will be a number of Answer records.  An Answer record always provides target text and an ‘isCorrect’ flag that is used later to automatically grade test results.
## /test-result/
This endpoint supports the reception of Test Results for a specific candidate translator, a specific Test, and an array of Answers.  Endpoint processing ‘marks’ the test and then flags the Test as passed or not depending on whether the minimum number of correct answers were achieved.
## /successful-candidates/
This endpoint simply returns a list of candidates who have successfully passed all of the self-administered tests for a given (source/target).
## /translation-test/
Allows the creation, and then later, deployment of translation tests for a selected source language.
## /translation-test-result/
Allows front-end software to deliver translated (target) text for subsequent marking by a senior translator.
## /successful-candidates/
This endpoint simply returns a list of candidates who have successfully passed all of the self-administered tests for a given (source/target).
# Redis-API Test
After cloning this repo, the API code can be exercised as follows:
<ul>
<li>$ npm install</li>
<li>$ redis-server # start a local instance of the Redis server</li>
<li>$ npm test</li>
</ul>

# Swagger Editor
The Swagger view of the API is available as follows: select http://swagger.io/swagger-editor/, select 'Online Editor' and then go to "File => Import File" to import the file 'Swagger/redis-api.yaml'.
