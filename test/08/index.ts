import assert from "assert/strict";
import fse from "fs-extra";
import { run } from "../misc.js";
import parse from "../../lib/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// RAP from Alaska

run(async () => {
  const rap = fse.readFileSync(`${__dirname}/rap.txt`).toString();

  const parsed = parse(rap);

  for (const datum of parsed[0].data) {
    if (datum.dewpt) {
      assert(datum.dewpt >= -1000);
      assert(datum.dewpt <= 1000);
    }
  }
});
