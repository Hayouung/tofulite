import Jasmine from "jasmine";

const jas = new Jasmine({});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

jas.loadConfig({
  spec_dir: "tests",
  spec_files: ["**/*test.ts"],
  random: false,
  seed: null,
  stopSpecOnExpectationFailure: false
});

jas.execute();
