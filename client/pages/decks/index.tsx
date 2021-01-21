import Head from 'next/head'
import {Box, Button, Card, CardContent, Typography} from '@material-ui/core';
import {useEffect} from 'react';
import Link from 'next/link';
import ButtonError from '../../components/shared/ButtonError';
import {NetworkStatus} from '@apollo/client';
import {initializeApollo} from '../../lib/apollo';
import {useCreateDeck, useDeleteDeck, useGetDecks, useUpdateDeck} from '../../apollo/actions';
import {GET_DECKS} from '../../apollo/queries';

export default function Decks() {
	const {data, networkStatus} = useGetDecks();
	const [createDeck] = useCreateDeck();
	const [deleteDeck] = useDeleteDeck();
	const [updateDeck] = useUpdateDeck();

	const decks = data && data.decks || [];

	useEffect(() => {
		console.log('networkStatus', networkStatus, NetworkStatus[networkStatus]);
	}, [networkStatus]);


	const handleCreateDeck = async () => {
		await createDeck();
	}

	const handleUpdateDeck = async (id: string) => {
		await updateDeck({variables: {id}});
	}

	const handleDeleteDeck = async (id: string) => {
		await deleteDeck({variables: {id}});
	}

	return (
		<>
			<Head>
				<title>Decks</title>
			</Head>
			<section>
				<h2>Decks</h2>
				<Button variant="contained" color="primary" onClick={handleCreateDeck}>Create deck</Button>
				<Box display="flex" flexWrap="wrap">
					{decks.map(deck => (
						<Box key={deck._id} m={1}>
							<Card>
								<CardContent>
									<Typography variant="h5" component="h2">
										{deck.title}
									</Typography>
									<Typography color="textSecondary" gutterBottom>
										{deck.company}
									</Typography>
									<Link href={`/decks/${deck._id}`}>
										<Button color="primary">show</Button>
									</Link>
									<Button color="primary"
											onClick={() => handleUpdateDeck(deck._id)}>edit</Button>
									<ButtonError
										onClick={() => handleDeleteDeck(deck._id)}>delete</ButtonError>
								</CardContent>
							</Card>
						</Box>
					))}
				</Box>
			</section>
		</>
	)
}

export async function getServerSideProps() {
	const apolloClient = initializeApollo()

	await apolloClient.query({
		query: GET_DECKS,
	})

	return {
		props: {
			initialApolloState: apolloClient.cache.extract(),
		},
	}
}
