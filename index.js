const { ApolloServer } = require('apollo-server');
const { GraphQLObjectType, GraphQLSchema } = require('graphql/type');
const { GraphQLList, GraphQLNonNull } = require('graphql/type/definition');
const {
  GraphQLInt,
  GraphQLString,
} = require('graphql/type/scalars');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
  
const ToDoType = new GraphQLObjectType({
    name: 'ToDo',
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
        toDos: {
            type: new GraphQLList(ToDoType),
            description: 'List of all to-dos',
            resolve: () => toDos,
        },
    }),
});

const IdType = new GraphQLObjectType({
    name: 'Id',
    description: 'An Id returned by the server',
    fields: () => ({
        id: { type: GraphQLInt },
    }),
  });
  
const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addToDo: {
            type: ToDoType,
            description: 'Adds a to-do',
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const ids = toDos.map(o => {
                    return o.id;
                });
                const max = Math.max(...ids);
                const toDo = {
                    id: max + 1,
                    title: args.title,
                    description: args.description,
                };
                toDos.push(toDo);
                return toDo;
            },
        },
        deleteToDo: {
            type: IdType,
            description: 'Deletes a toDo',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const index = toDos.findIndex(function(o) {
                    return o.id === args.id;
                })
                if (index !== -1) toDos.splice(index, 1);
                return { id: args.id};
            },
        },
    }),
});
  
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});

const toDos = [
    {
        id: 1,
        title: 'Laundry',
        description: 'Whites and colors',
    },
    {
        id: 2,
        title: 'Dry cleaner',
        description: 'Pick up suit',
    },
    {
        id: 3,
        title: 'Clean bathroom',
        description: 'Need to get cleaning supplies',
    },
    {
        id: 4,
        title: 'Homework',
        description: 'Physics assignment',
    },
    {
        id: 5,
        title: 'Groceries',
        description: 'Eggs, milk, bacon, cheese',
    },
];
const resolvers = {
    Query: {
        toDos: () => toDos,
    },
};

const server = new ApolloServer({ schema, resolvers, plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
], });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});