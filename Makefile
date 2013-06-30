
public: component.json
	@component build -o ./public -n app

run: public
	@NODE_PATH=lib node bin/fancy-doc

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

clean:
	rm -rf components public

.PHONY: test clean
