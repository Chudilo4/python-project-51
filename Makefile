publish:
	poetry publish --dry-run

package-install:
	python3 -m pip install --force-reinstall --user dist/*.whl

lint:
	poetry run flake8 page_loader/
	poetry run flake8 tests/

install:
	poetry install

test:
	poetry run pytest --cov

test-coverage:
	poetry run pytest --cov=page_loader/ --cov-report xml

selfcheck:
	poetry check

check: selfcheck test lint

build: check
	poetry build
