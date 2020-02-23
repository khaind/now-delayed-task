const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const nodemailer = require("nodemailer");

const typeDefs = gql`
  extend type Query {
    hi(first: Int = 5): String
    sendEmail(amount: Float!): Boolean
    sendEmailAwait(amount: Float!): Boolean
  }
`;

const sendEmailAsync = async amount => {
  console.log(`sendEmailAsync`);

  return new Promise((resolve, reject) => {
    console.log(`sendEmailAsync promise`);
    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "70605ac44f25f2",
        pass: "047e672658ad8b"
      }
    });

    let message = {
      from: `federation delayed task zeit now`, // sender address
      to: `testuser@emaildomain.com`, //process.env.SJMBT_ADMIN_EMAIL_ADDR,
      subject: `Test email`,
      text: `
  New amount is set: ${amount}

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
      console.log( `done` );
      resolve(info);
    });
  });
};

const resolvers = {
  Query: {
    hi ( _, args ) {
      console.log(`hi ... `);
      return `Hello ${args.first}`;
    },
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
      resolvers
    }
  ])
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`Email Server ready at ${url}`);
});
