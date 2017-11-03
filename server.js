const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphql, buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    user(max: Int = 10): [User]
    hello: String
    getDie(numSides: Int): RandomDie
    quoteOfTheDay: String
    random: Float!
  }
  type User {
    name: String
    address: String
  }
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }
`);

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({ numRolls }) {
    return [...Array(numRolls)].map(_ => this.rollOnce());
  }
}

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
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6);
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
