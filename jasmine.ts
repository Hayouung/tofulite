import Jasmine from "jasmine";

const jas = new Jasmine({});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

jas.loadConfig({
  spec_dir: "src",
  spec_files: ["**/*spec.ts"],
  random: false,
  seed: null,
  stopSpecOnExpectationFailure: false
});

jas.execute();
