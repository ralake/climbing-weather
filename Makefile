BIN = ./node_modules/.bin

.PHONY: bootstrap build server start lint deploy

start: lint build server

watch: lint build-watch

server:
	node app

server-watch:
	$(BIN)/nodemon .

lint:
	$(BIN)/standard

build:
	$(BIN)/webpack -p --progress --colors

build-watch:
	$(BIN)/webpack -p --progress --colors -w

bootstrap:
	npm install

deploy:
	gcloud app deploy