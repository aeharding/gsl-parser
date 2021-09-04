import assert from "assert";
import * as fse from "fs-extra";
import { run } from "../misc";
import parse from "../../lib";

run(async () => {
  const rap = fse.readFileSync(`${__dirname}/rap.txt`).toString();

  assert.throws(() => parse(rap));
});
