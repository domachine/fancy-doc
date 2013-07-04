
build: components index.js boot.css
	@component build --dev

components: component.json
	@component install --dev

test:
	@NODE_PATH=.. ../../node_modules/.bin/mocha \
		--reporter spec

clean:
	rm -fr build components template.js

.PHONY: test clean
