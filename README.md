# FakeStore API Cart Automation

Playwright + JavaScript API automation suite for FakeStore API:
https://fakestoreapi.com/

This project covers Assignment 2: Cart CRUD testing for `POST /carts`, `GET /carts`, `GET /carts/{id}`, `PUT /carts/{id}`, and `DELETE /carts/{id}`, plus authentication, negative cases, response schema validation, data-driven product coverage, and a cart contract test.

## Framework Choice

I used Playwright with JavaScript because it supports API testing without a browser, has a simple request fixture, works well in CI, and includes built-in HTML, JSON, and JUnit reporting. It also keeps the framework lightweight because no extra REST client or assertion library is required.

## Project Structure

```text
.
|-- .github/workflows/playwright-api.yml
|-- docs/API_TEST_REPORT.md
|-- tests/
|   |-- contracts/cart.contract.json
|   |-- data/testData.js
|   |-- helpers/cartSchema.js
|   |-- auth.spec.js
|   |-- cart-contract.spec.js
|   |-- cart-crud.spec.js
|   |-- cart-quality.spec.js
|   |-- cart-query.spec.js
|   `-- cart-security-validation.spec.js
|-- package.json
|-- package-lock.json
|-- playwright.config.js
`-- README.md
```

## Test Coverage

| Area | Coverage |
| --- | --- |
| Authentication | Valid login token and invalid credentials |
| Cart GET | List carts and get cart by id |
| Cart POST | Create cart with product payload |
| Cart PUT | Update existing cart payload |
| Cart DELETE | Delete existing cart |
| Cart query/filtering | Limit, descending sort, user cart lookup, and date range filtering |
| Quality and data integrity | JSON content type, response time smoke check, unique cart IDs, valid dates, product references, user references, and mock persistence behavior |
| Negative cases | Invalid auth, unknown cart id, invalid cart id path, invalid update id, unknown delete id, empty POST payload, invalid product payload, nonexistent product id, zero/negative quantity, and malformed products field |
| Security checks | Writes without auth token and with invalid token are documented as API validation gaps |
| Schema validation | Cart object and cart product object validation |
| Data-driven test | Same create-cart scenario across 4 product IDs |
| Contract test | Saved cart response shape compared with live response shape |

## Run Tests

```bash
npm install
npm test
```

View the HTML report:

```bash
npm run report
```

## Execution Result

Latest local run:

```text
35 passed
```

Detailed scenario notes, observed API gaps, and manual testing evidence are documented in `docs/API_TEST_REPORT.md`.

## Manual Testing Evidence

Manual API testing was also completed before/alongside automation. Supporting result screenshots are available in:

```text
C:\Users\sahithi.kotagiri\Downloads\fakestoreapi_screenshots.zip
```

The screenshot bundle contains 38 manual result images. The manual results align with the automated coverage and observed API gaps documented in `docs/API_TEST_REPORT.md`.

## Reporting

Configured reporters:

- HTML report: `playwright-report/`
- JSON report: `test-results/results.json`
- JUnit report: `test-results/junit.xml`
- Console list reporter

Generated report/result folders are ignored by Git and recreated on each run.

## CI/CD

GitHub Actions workflow: `.github/workflows/playwright-api.yml`

The workflow runs on:

- `push`
- `pull_request`

It installs dependencies, runs the Playwright API suite, and uploads reports/results as workflow artifacts.

## Extension Plan

- Parallelisation: Playwright `fullyParallel` is enabled. Local runs use Playwright's default worker count, and CI uses 2 workers for stable execution.
- Reporting: Add Allure or dashboard reporting for trends, response-time history, and endpoint-level pass/fail summaries.
- Contract testing: Expand contract files for auth, product, user, and cart list responses.
- Test expansion: Add boundary tests for cart dates, user IDs, product quantities, query params, and cross-resource consistency with `/products`.
