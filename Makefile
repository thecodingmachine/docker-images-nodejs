blueprint: ## Generate all blueprints file
	@if ! type orbit >/dev/null 2>&1; then echo "Missing orbit dependency, please install from https://github.com/gulien/orbit/"; exit 1; fi
	orbit run generate

test-latest: test-26 ## Test the latest build only

test-20: ## Test node 20 build only
test-%: blueprint ## Test node X build
	BRANCH=master VARIANT=$(*)-trixie TAG=v2-$(*)-trixie ./build-and-test.sh || (notify-send -u critical "Tests failed" && exit 1)
	BRANCH=master VARIANT=$(*)-trixie-build TAG=v2-$(*)-trixie-build ./build-and-test.sh || (notify-send -u critical "Tests failed" && exit 1)
	BRANCH=master VARIANT=$(*)-apache-trixie TAG=v2-$(*)-apache-trixie ./build-and-test.sh || (notify-send -u critical "Tests failed" && exit 1)
	BRANCH=master VARIANT=$(*)-apache-trixie-build TAG=v2-$(*)-apache-trixie-build ./build-and-test.sh || (notify-send -u critical "Tests failed" && exit 1)
	notify-send -u critical "Tests passed with success for $*"

clean: ## Clean dangles image after build
