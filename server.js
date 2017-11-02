const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    name: String
    address: String
  }
  type Query {
    user(max: Int = 10): [User]
  }
`);

const root = {
  user: (...args) => {
    console.log(args);
    return [];
  },
};

const query = `
  {
    user {
      name
    }
  }
`

graphql(schema, query, root)
  .then(response => {
    console.log(response);
  });