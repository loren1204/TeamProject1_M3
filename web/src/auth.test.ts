import { test } from "node:test";
import assert from "node:assert/strict";
import {
  accountRole,
  accountStorageKey,
  validateNewPassword,
} from "./auth-config";
test("accounts default to student; only admin-owned app metadata grants instructor access", () => {
  assert.equal(accountRole(undefined), "student");
  assert.equal(accountRole({ role: "student" }), "student");
  assert.equal(accountRole({ role: "instructor" }), "instructor");
  assert.equal(accountRole({ role: "admin" }), "student");
});
test("account workspace keys are isolated from each other and guest demonstration state", () => {
  assert.notEqual(
    accountStorageKey("student-a"),
    accountStorageKey("student-b"),
  );
  assert.notEqual(accountStorageKey("student-a"), accountStorageKey(null));
});
test("new passwords enforce length and matching confirmation", () => {
  assert(validateNewPassword("short"));
  assert(validateNewPassword("a".repeat(129)));
  assert(validateNewPassword("Sufficient123", "Different123"));
  assert.equal(validateNewPassword("Sufficient123", "Sufficient123"), "");
});
