import assert from "assert/strict";
import fse from "fs-extra";
import { run } from "../misc.js";
import parse from "../../lib/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// RAP from Osaka, Japan
// There is no space between lat and lon in the identification line
// of the report ("34.50-135.50"), so this tests for that.

run(async () => {
  const rap = fse.readFileSync(`${__dirname}/rap.txt`).toString();

  const report = parse(rap);

  assert.strictEqual(report[0].lat, -25);
  assert.strictEqual(report[0].lon, -135);
});
