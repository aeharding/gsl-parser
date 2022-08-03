import assert from "assert/strict";
import fse from "fs-extra";
import { run } from "../misc.js";
import parse from "../../lib/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// File has the following in it:
//
// timeout
// Bad eval: 1 at ./get_model_file.pl line 9.
//
// Should parse it out
run(async () => {
  const rap = fse.readFileSync(`${__dirname}/rap.txt`).toString();
  const result = parse(rap);

  assert.strictEqual(result.length, 2);
});
