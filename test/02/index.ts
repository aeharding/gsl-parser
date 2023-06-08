import assert from "assert/strict";
import fse from "fs-extra";
import { run } from "../misc.js";
import parse from "../../lib/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

run(async () => {
  const rap = fse.readFileSync(`${__dirname}/rap.txt`).toString();
  const result = JSON.parse(JSON.stringify(parse(rap)));

  const expected = fse.readJSONSync(`${__dirname}/expected.json`);

  assert.deepStrictEqual(result, expected);
});
