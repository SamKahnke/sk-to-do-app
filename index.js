const { ApolloServer, gql } = require('apollo-server');
const { GraphQLObjectType, GraphQLSchema } = require('graphql/type');
const { GraphQLList, GraphQLNonNull } = require('graphql/type/definition');
const {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql/type/scalars');
const ApolloServerPluginLandingPageGraphQLPlayground = require("apollo-server-core");
  
const TodoType = new GraphQLObjectType({
    name: 'Todo',
    description: 'A task that needs to be done',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLInt) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      isComplete: { type: new GraphQLNonNull(GraphQLBoolean) },
    }),
  });
  
  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      todos: {
        type: new GraphQLList(TodoType),
        description: 'List of all todos',
        resolve: () => todos,
      },
    }),
  });
  
  const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addTodo: {
        type: TodoType,
        description: 'Adds a todo',
        args: {
          title: { type: new GraphQLNonNull(GraphQLString) },
          description: { type: new GraphQLNonNull(GraphQLString) },
          isComplete: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
        resolve: (parent, args) => {
          const todo = {
            id: todos.length + 1,
            title: args.title,
            description: args.description,
            isComplete: args.isComplete,
          };
          todos.push(todo);
          return todo;
        },
      },
      updateTodo: {
        type: TodoType,
        description: 'Updates a todo',
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve: (parent, args) => {
        todos.find(todo => todo.id === args.id).isComplete = true;
          return todos.find(todo => todo.id === args.id);
        },
      },
    }),
  });
  
  const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
  });

const todos = [
    {
      id: 1,
      title: 'Wash dishes',
      description: 'Get them clean.',
      isComplete: false,
    },
    {
      id: 2,
      title: 'Do laundry',
      description: 'Remember to fold',
      isComplete: false,
    },
    {
      id: 3,
      title: 'Clean bathroom',
      description: 'Get it clean.',
      isComplete: false,
    },
    {
      id: 4,
      title: 'Comb hair',
      description: 'Get them straight.',
      isComplete: false,
    },
  ];
  const resolvers = {
    Query: {
      todos: () => todos,
    },
  };

const server = new ApolloServer({ schema, resolvers,   plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground,
  ], });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});