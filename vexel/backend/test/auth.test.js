import test from "node:test";
import assert from "node:assert/strict";
import { createAuthRequired } from "../src/middlewares/auth-token.js";

function response() {
  return {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

for (const header of [undefined, "", "Basic abc", "Bearer ", "Bearer a b", ["Bearer abc"]]) {
  test("rejects missing or malformed authorization: " + JSON.stringify(header), async () => {
    let called = false;
    const middleware = createAuthRequired(async () => { called = true; });
    const res = response();
    await middleware({ headers: { authorization: header } }, res, () => assert.fail("must not proceed"));
    assert.equal(res.statusCode, 401);
    assert.equal(called, false);
  });
}

test("attaches the verified identity and checks revocation", async () => {
  const identity = { uid: "test-user" };
  const middleware = createAuthRequired(async (token, checkRevoked) => {
    assert.equal(token, "test-token");
    assert.equal(checkRevoked, true);
    return identity;
  });
  const req = { headers: { authorization: "bearer test-token" } };
  const res = response();
  let nextCalls = 0;
  await middleware(req, res, () => { nextCalls += 1; });
  assert.equal(req.user, identity);
  assert.equal(nextCalls, 1);
  assert.equal(res.statusCode, 200);
});

test("rejects verification errors without returning token details", async () => {
  const middleware = createAuthRequired(async () => { throw new Error("sensitive-detail"); });
  const res = response();
  await middleware({ headers: { authorization: "Bearer test-token" } }, res, () => assert.fail("must not proceed"));
  assert.equal(res.statusCode, 401);
  assert.equal(JSON.stringify(res.body).includes("sensitive-detail"), false);
});

test("does not misclassify a downstream exception as an authentication error", async () => {
  const middleware = createAuthRequired(async () => ({ uid: "test-user" }));
  const res = response();
  await assert.rejects(
    middleware({ headers: { authorization: "Bearer test-token" } }, res, () => { throw new Error("downstream"); }),
    /downstream/
  );
  assert.equal(res.statusCode, 200);
});

