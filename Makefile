.PHONY: generate-client

generate-client:
	docker run --rm -v "$$(pwd):/local" openapitools/openapi-generator-cli generate \
		-i /local/openapi.yaml \
		-g typescript-axios \
		-o /local/frontend/src/api
