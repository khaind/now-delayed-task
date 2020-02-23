const https = require("https");
module.exports = async (host, message) => {
  //   data = JSON.stringify({
  //     query: '{hi(first: 1)}'
  //   });
  console.log( `delegated with message: ${ message }` );
  var options = {
    hostname: host,
    method: "POST",
    path: "/",
    port: 443,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": message.length //Buffer.byteLength(message)
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
      console.log("NOW it's not λ1's problem anymore.");
      resolve();
    });
  });
};
