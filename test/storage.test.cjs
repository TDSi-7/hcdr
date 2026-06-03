const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(this, path.join(projectRoot, request.slice(2)), parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020
    },
    fileName: filename
  });
  module._compile(outputText, filename);
};

class MemorySessionStorage {
  constructor() {
    this.items = new Map();
  }

  getItem(key) {
    return this.items.has(key) ? this.items.get(key) : null;
  }

  setItem(key, value) {
    this.items.set(key, String(value));
  }

  removeItem(key) {
    this.items.delete(key);
  }
}

function installWindow() {
  const sessionStorage = new MemorySessionStorage();
  global.window = { sessionStorage };
  return sessionStorage;
}

const storage = require("../lib/storage.ts");

const validAnswers = {
  1: "new",
  2: "isc",
  3: "3-4",
  4: "discomfort",
  5: "unaware_can_ask",
  6: "work",
  7: "comfort",
  8: "collect",
  9: "4"
};

const legacyEightQuestionAnswers = {
  1: "new",
  2: "3-4",
  3: "discomfort",
  4: "happy",
  5: "work",
  6: "comfort",
  7: "collect",
  8: "4"
};

test("current quiz answers save and load from versioned storage", () => {
  installWindow();

  storage.saveAnswers(validAnswers);

  assert.deepEqual(storage.loadAnswers(), validAnswers);
  assert.equal(storage.isValidQuizAnswerSet(validAnswers), true);
});

test("legacy 8-question answers are rejected instead of remapped", () => {
  const sessionStorage = installWindow();

  storage.saveAnswers(legacyEightQuestionAnswers);

  assert.deepEqual(storage.loadAnswers(), {});
  assert.equal(storage.isValidQuizAnswerSet(legacyEightQuestionAnswers), false);
  assert.equal(sessionStorage.items.size, 0);
});
