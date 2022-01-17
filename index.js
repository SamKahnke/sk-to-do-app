const { ApolloServer, gql } = require('apollo-server');
const { GraphQLObjectType, GraphQLSchema } = require('graphql/type');
const { GraphQLList, GraphQLNonNull } = require('graphql/type/definition');
const {
  GraphQLInt,
  GraphQLString,
} = require('graphql/type/scalars');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
  
const TodoType = new GraphQLObjectType({
    name: 'Todo',
    description: 'A task that needs to be done',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLInt) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
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

  const MessageType = new GraphQLObjectType({
    name: 'Message',
    description: 'A message returned by the server',
    fields: () => ({
      message: { type: new GraphQLNonNull(GraphQLString) },
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
        },
        resolve: (parent, args) => {
            const ids = todos.map(o => {
                return o.id;
              });
              const max = Math.max(...ids);
          const todo = {
            id: max + 1,
            title: args.title,
            description: args.description,
          };
          todos.push(todo);
          return todo;
        },
      },
      deleteTodo: {
        type: MessageType,
        description: 'Adds a todo',
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve: (parent, args) => {
            const index = todos.findIndex(function(o){
                return o.id === args.id;
           })
           if (index !== -1) todos.splice(index, 1);
          return { message: `Todo item ${args.id} deleted.`};
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
    },
    {
      id: 2,
      title: 'Do laundry',
      description: 'Remember to fold',
    },
    {
      id: 3,
      title: 'Clean bathroom',
      description: 'Get it clean.',
    },
    {
      id: 4,
      title: 'Comb hair',
      description: 'Get them straight.',
    },
  ];
  const resolvers = {
    Query: {
      todos: () => todos,
    },
  };

const server = new ApolloServer({ schema, resolvers,   plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ], });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});