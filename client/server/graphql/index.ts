import {ApolloServer, gql} from 'apollo-server-express';
import type from './types';
import {deckMutations, deckQueries} from './resolvers/deck';
import cardQueries from './resolvers/card';
import {userMutations} from './resolvers/user';

const typeDefs = gql`${type}`;

const resolvers = {
	Query: {
		...deckQueries,
		...cardQueries,
	},
	Mutation: {
		...deckMutations,
		...userMutations,
	},
};

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
})

export default apolloServer;
