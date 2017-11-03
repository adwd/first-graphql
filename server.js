const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphql, buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  # input types
  # Input types can't have fields that are other objects,
  # only basic scalar types, list types, and other input types.
  input MessageInput {
    content: String
    author: String
  }

  type Query {
    user(max: Int = 10): [User]
    hello: String
    getDie(numSides: Int): RandomDie
    quoteOfTheDay: String
    random: Float!
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }

  type Message {
    id: ID!
    content: String
    author: String
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

// If Message had any complex fields, we'd put them on this object.
class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

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

let fakeDatabase = {};

// The root provides a resolver function for each API endpoint
const root = {
  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage: ( {input }) => {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
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
