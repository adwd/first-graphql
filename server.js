const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphql, buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    user(max: Int = 10): [User]
    hello: String
  }
  type User {
    name: String
    address: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  user: (...args) => {
    // args.forEach(console.log);
    console.log(args.length);
    return [];
  },
  hello: () => {
    return 'Hello World!';
  },
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
