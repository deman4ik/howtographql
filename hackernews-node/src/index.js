const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: (root, args, context, info) => context.db.query.links({}, info)
    },
    Mutation: {
        post: (root, args, context, info) =>
            context.db.mutation.createLink(
                {
                    data: {
                        url: args.url,
                        description: args.description
                    }
                },
                info
            )
    }
};

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'http://localhost:4466/hackernews-node/dev',
            secret: 'ouuyeahbabyitstripple',
            debug: true
        })
    })
});

server.start(() => console.log(`Server is running on http://localhost:4000`)); // eslint-disable-line
