require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require( "@apollo/gateway" );

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: "accounts",
      url:
        process.env.ACCOUNTS_MICRO_ENDPOINT || "http://localhost:4001/accounts"
    },
    {
      name: "reviews",
      url: process.env.REVIEWS_MICRO_ENDPOINT || "http://localhost:4002/reviews"
    },
    {
      name: "products",
      url:
        process.env.PRODUCTS_MICRO_ENDPOINT || "http://localhost:4003/products"
    },
    {
      name: "inventory",
      url:
        process.env.INVENTORY_MICRO_ENDPOINT ||
        "http://localhost:4004/inventory"
    },
    {
      name: "email",
      url: process.env.EMAIL_MICRO_ENDPOINT || "http://localhost:4005/email"
    }
  ]
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    schema,
    executor,
    introspection: true, // enables introspection of the schema
    playground: true // enables the actual playground
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
