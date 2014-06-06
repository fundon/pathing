TESTS = test/*.test.js
REPORTER = spec
MOCHA_OPTS =

benchmark:
	@node benchmark/path.js

test:
	@NODE_ENV=test node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

cov:
	@istanbul cover node_modules/mocha/bin/_mocha -- \
		--reporter $(REPORTER) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

.PHONY: benchmark test cov