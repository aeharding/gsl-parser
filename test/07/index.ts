import assert from "assert/strict";
import fse from "fs-extra";
import { run } from "../misc.js";
import parse from "../../lib/index.js";
import { GslError } from "../../lib/errors.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// RAP from Alaska

run(async () => {
  const rap = fse.readFileSync(`${__dirname}/rap.txt`).toString();

  assert.throws(() => parse(rap));

  try {
    parse(rap);
  } catch (error) {
    assert(error instanceof GslError);
  }
});
