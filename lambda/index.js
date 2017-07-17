const execFile = require('child_process').execFile;
const fs = require("fs");

exports.handler = function(event, context) {
  var records = event.Records;
  var context = context;

  var verb = process.env.SKIP_SEND === "true" ? "SKIPPING " : "Received ";
  console.log(verb + records.length + " records.")

  if (process.env.DEBUG_LOGGING === "true") {
    console.log(`DEBUG: Received event data: ${JSON.stringify(records)}`);
  }

  if (process.env.SKIP_SEND !== "true") {
    var fileName = "/tmp/" + context.invokeid + ".json";

    fs.writeFile(fileName, JSON.stringify(records), (err) => {
      if (err) throw err;

      execFile('./ruby_wrapper', [fileName, JSON.stringify(context)], {}, (error, stdout, stderr) => {
        stdout.trim().split("\n").forEach(function(x) {
          log = x.trim();
          if (log !== "") {
            console.log(log);
          }
        });
        stderr.trim().split("\n").forEach(function(x) {
          log = x.trim();
          if (log !== "") {
            console.log(log);
          }
        });
        if (error) {
          console.error(`exec error: ${error}`);
          process.exit(1);
        }
      });
    });
  }
};
