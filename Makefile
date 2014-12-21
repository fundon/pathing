TESTS = test/*.test.js
REPORTER = spec
MOCHA_OPTS =

node_modules:
	@npm install

bench: node_modules
	@node benchmark/path.js

test: node_modules
	@NODE_ENV=test node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

cov: node_modules
	@istanbul cover node_modules/mocha/bin/_mocha -- \
		--reporter $(REPORTER) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

.PHONY: bench test cov