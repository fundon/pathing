TESTS = test/*.test.js
REPORTER = spec
MOCHA_OPTS =

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

.PHONY: test