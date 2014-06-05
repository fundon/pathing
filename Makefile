TESTS = test/*.test.js
REPORTER = spec
MOCHA_OPTS =

benchmark:
	@node benchmark/path.js

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

.PHONY: test benchmark