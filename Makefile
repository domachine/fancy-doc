
COMPONENTS = $(shell find lib -name 'component.json')

public: components
	@component build --dev -o ./public -n app
	@touch public

components: component.json $(COMPONENTS)
	@component install --dev
	@test -d components || mkdir components
	@touch components

run: public
	@NODE_PATH=lib node bin/fancy-doc

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

clean:
	rm -rf components public

.PHONY: test clean
