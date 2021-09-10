import assert from "assert/strict";
import * as fse from "fs-extra";
import { run } from "../misc";
import parse from "../../lib";
import { CoordinatesGslError } from "../../lib/errors";

// RAP from Alaska

run(async () => {
  const rap = fse.readFileSync(`${__dirname}/rap.txt`).toString();

  assert.throws(() => parse(rap));

  try {
    parse(rap);
  } catch (error) {
    assert(error instanceof CoordinatesGslError);
  }
});
