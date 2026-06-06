# FakeStore API Test Report

## Scope

Target API: `https://fakestoreapi.com`

Main feature under test: Cart CRUD, authentication, cart response schema, query/filter behavior, validation, security behavior, and cart data integrity.

## Test Design

The suite is written from a tester's point of view:

- Verify happy paths first: auth token generation and cart CRUD.
- Validate response contracts: status code, JSON body, required fields, and data types.
- Exercise realistic user flows: list carts, filter carts, fetch cart by user, create/update/delete cart.
- Check data quality: duplicate IDs, parseable dates, cart product IDs exist in product catalog, cart user IDs exist in user catalog.
- Probe negative and security behavior: invalid login, invalid IDs, missing token, invalid token, malformed payloads, invalid product IDs, zero/negative quantities.
- Document mock API limitations instead of hiding them.

## Requirement Coverage

| Requirement Area | Status | Evidence |
| --- | --- | --- |
| API automation framework | Covered | Playwright with JavaScript |
| Cart create | Covered | `POST /carts` tests |
| Cart list/read | Covered | `GET /carts` and `GET /carts/{id}` tests |
| Cart update | Covered | `PUT /carts/{id}` tests |
| Cart delete | Covered | `DELETE /carts/{id}` tests |
| Authentication | Covered | Valid and invalid login tests |
| Positive scenarios | Covered | CRUD, auth, query, and schema tests |
| Negative scenarios | Covered | Invalid credentials, invalid IDs, malformed payloads, bad quantities |
| Schema validation | Covered | Cart and cart-product schema helper |
| Data-driven testing | Covered | Create-cart test across product IDs `1`, `2`, `3`, and `4` |
| Query/filter testing | Covered | Limit, descending sort, user carts, and date range |
| Contract testing | Covered | Saved cart contract compared with live response shape |
| Security/validation checks | Covered | Missing and invalid token behavior documented as API gaps |
| Reporting | Covered | HTML, JSON, JUnit, console output, and this report |
| CI/CD | Covered | GitHub Actions workflow |
| Manual testing evidence | Covered | Screenshot bundle listed below |

## Scenario Summary

| Category | Examples |
| --- | --- |
| Positive | `GET /carts`, `GET /carts/1`, `POST /carts`, `PUT /carts/7`, `DELETE /carts/6` |
| Negative | Invalid auth, unknown cart, invalid cart path, invalid update path, unknown delete |
| Authentication | Valid login returns token; invalid login rejected |
| Schema | Cart and cart-product shape validation |
| Contract | Saved response shape compared with live `/carts/1` response |
| Data-driven | Create cart with product IDs `1`, `2`, `3`, and `4` |
| Query/filter | Limit, descending sort, user carts, date range |
| Data integrity | Product references exist; user references exist; cart IDs are unique |
| Security/validation gaps | Missing token and invalid token still allow cart creation |

## Observations / Bugs

| ID | Severity | Area | Observation | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- |
| BUG_001 | High | Auth | Cart creation works without auth token | Mutating cart APIs should require valid auth | `POST /carts` succeeds without token | Open |
| BUG_002 | High | Auth | Cart creation works with invalid bearer token | Invalid token should be rejected | `POST /carts` succeeds with invalid token | Open |
| BUG_003 | High | Validation | Nonexistent `productId` is accepted | Product ID should exist in catalog | API accepts `productId: 99999` | Open |
| BUG_004 | Medium | Validation | Zero/negative quantity is accepted | Quantity should be positive | API accepts `0` and `-1` | Open |
| BUG_005 | Medium | Validation | Malformed `products` field is accepted | `products` should be an array | API accepts object instead of array | Open |
| BUG_006 | Medium | Persistence | Created cart is not persisted | Created cart should be retrievable by ID | `POST` returns ID, but `GET /carts/{id}` returns empty/null | Open |

## Execution Result

Latest local run:

```text
35 passed
```

## Manual Testing Evidence

Manual API testing was completed on June 5, 2026. The captured result screenshots are stored in:

```text
C:\Users\sahithi.kotagiri\Downloads\fakestoreapi_screenshots.zip
```

The screenshot bundle contains 38 manual result images covering the tested FakeStore API scenarios. These results support the same cart CRUD, authentication, query/filtering, validation, and documented API-gap findings covered by the automation suite.
