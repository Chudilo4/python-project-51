build:
	poetry build
publish:
	poetry publish --dry-run
package-install:
	python3 -m pip install --force-reinstall --user dist/*.whl
make lint:
	poetry run flake8 page_loader/
	poetry run flake8 tests/
install:
	poetry install
test:
	poetry run pytest -vv --cov
test-coverage:
	poetry run pytest --cov=tests/ --cov-report xml