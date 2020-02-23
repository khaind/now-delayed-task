require("dotenv").config({ path: "../../.env" });
const delegate = require("./delegate");

const testCallLambda = async () => {
  console.log(`test - start - host: ${process.env.HOST}`);
    var postData = JSON.stringify( {
        query: "query {\r\n  sendEmailAwait(amount: 1)\r\n}"
    } );
//     `query {
//     #sendEmailAwait(amount: 0.99)
//     hi(first: 1)
// }`;
  await delegate(process.env.HOST || "http://localhost:3000", postData);
  console.log(`test - end`);
};

testCallLambda()
    .then( ( res ) => { console.log( `then, might be ok ${ res }` ) } )
    .catch( ( err ) => { console.error( `oops, err: ${ err }` ) } );
