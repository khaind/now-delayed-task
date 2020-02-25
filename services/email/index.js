const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const nodemailer = require("nodemailer");

const typeDefs = gql`
  extend type Query {
    sendEmail(amount: Float!): Boolean
    sendEmailAwait(amount: Float!): Boolean
  }
`;

const sendEmailAsync = async amount => {
  console.log(`sendEmailAsync`);

  return new Promise((resolve, reject) => {
    console.log(`sendEmailAsync promise`);
    let transporter = nodemailer.createTransport({
      host: `${process.env.SMTP_HOST}`,
      port: `${process.env.SMTP_PORT}`,
      auth: {
        user: `${process.env.EMAIL_AUTH_USER}`,
        pass: `${process.env.EMAIL_AUTH_PASS}`
      }
    });

    let message = {
      from: `federation delayed task zeit now <khainguyen@demo.com>`, // sender address
      to: `testuser@emaildomain.com`,
      subject: `Test email`,
      text: `
  Top product is fetched ${amount} items

  Thank you,` // plain text body
    };
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(`Error occurred while sending message: ${message.text}`);
        console.error(error.message);
        reject(error);
        return;
      }
      // Only needed when used pooled
      // transporter.close();
      console.log(`done`);
      resolve(info);
    });
  });
};

const resolvers = {
  Query: {
    async sendEmailAwait(_, args) {
      let rs = false;
      try {
        let info = await sendEmailAsync(args.amount);
        if (info) {
          console.log(`info: ${JSON.stringify(info)}`);
          rs = true;
        }
      } catch (err) {
        console.error(JSON.stringify(err));
      }
      return rs;
    },
    async sendEmail(_, args) {
      let rs = false;
      sendEmailAsync(args.amount)
        .then(res => {
          console.log(`Send notification email to admin successful ${res}`);
        })
        .catch(err => {
          console.error(
            `Send notification email to admin failed with error: ${JSON.stringify(
              err
            )}`
          );
        });

      return true;
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
      introspection: true, // enables introspection of the schema
      playground: true // enables the actual playground
    }
  ])
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`Email Server ready at ${url}`);
});
