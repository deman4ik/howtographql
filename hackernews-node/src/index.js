const { GraphQLServer } = require("graphql-yoga");

let links = [
    {
        id: "link-0",
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL"
    }
];

let idCount = links.length;

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (root, args) => {
            const link = links.find(x => x.id === args.id);
            return link;
        }
    },
    Mutation: {
        post: (root, args) => {
            const link = {
                id: `link-${(idCount += 1)}`,
                description: args.description,
                url: args.url
            };
            links.push(link);
            return link;
        },
        updateLink: (root, args) => {
            const linkIndex = links.findIndex(x => x.id === args.id);
            links = [
                ...links.slice(0, linkIndex),
                {
                    ...links[linkIndex],
                    url: args.url ? args.url : links[linkIndex].url,
                    description: args.description ? args.description : links[linkIndex].description
                },
                ...links.slice(linkIndex + 1)
            ];
            return links.find(x => x.id === args.id);
        },
        deleteLink: (root, args) => {
            const linkIndex = links.findIndex(x => x.id === args.id);
            links = [...links.slice(0, linkIndex), ...links.slice(linkIndex + 1)];
        }
    }
};

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`)); // eslint-disable-line
