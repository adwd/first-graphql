const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphql, buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    user(max: Int = 10): [User]
    hello: String
    rollDice(numDice: Int!, numSides: Int): [Int]
    quoteOfTheDay: String
    random: Float!
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
  rollDice: ({ numDice, numSides }, ...args) => {
    return [...Array(numDice)].map(_ => 1 + Math.floor(Math.random() * numSides));
  },
  random: () => {
    return Math.random();
  },
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
