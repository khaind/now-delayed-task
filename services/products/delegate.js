const https = require("https");
module.exports = async (host, message) => {
  console.log( `delegated with message: ${ message }` );
  var options = {
    hostname: host,
    method: "POST",
    path: "/",
    port: 443,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": message.length
    }
    // body: message
  };
  await new Promise((resolve, reject) => {
    let req = https.request(options);
    req.on("error", e => {
      console.error(`problem with request: ${e.message}`);
      reject(e);
    });
    req.write(message);
    req.end(() => {
      console.log("Delegated to other serverless function");
      resolve();
    });
  });
};
