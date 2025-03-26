import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

//server setup

const server = new ApolloServer({
//typedefs - definitions of types of data we want to expose to Graph
//resolvers
})

const {url} = await startStandaloneServer(server, {
    listen: {port:4000}
})

console.log('Server ready at port', 4000)