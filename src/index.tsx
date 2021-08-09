import React from 'react';
import {
	PluginClient,
	usePlugin,
	createState,
	useValue,
	Layout,
} from 'flipper-plugin';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactJson from 'react-json-view';

const EXPECTED_API_VERSION = 0;

type Data = {
	key: string;
	message?: string | number;
};

type Events = {
	newRow: Data;
	apiVersion: Data;
};

export function plugin(client: PluginClient<Events, {}>) {
	const data = createState<Record<string, Data>>({}, { persist: 'data' });

	client.onMessage('newRow', newRow => {
		data.update(draft => {
			draft[newRow.key] = newRow;
		});
		console.log({ newRow });
	});

	client.onMessage('apiVersion', ({ message }) => {
		console.log({ message });
		if (message! > EXPECTED_API_VERSION) {
			console.error(
				'The instance of react-native-recoil-flipper-client installed in the app is sending using a newer data API version than expected; please update this Flipper plugin.',
			);
		}
		if (message! < EXPECTED_API_VERSION) {
			console.error(
				'The instance of react-native-recoil-flipper-client installed in the app is sending using an older data API version than expected; please update react-native-recoil-flipper-client.',
			);
		}
		if (message === EXPECTED_API_VERSION) {
			// responder.success({ ack: true });
		}
	});

	client.addMenuEntry({
		action: 'clear',
		handler: async () => {
			data.set({});
		},
	});

	return { data };
}

export function Component() {
	const instance = usePlugin(plugin);
	const data = useValue(instance.data);

	return (
		<Layout.ScrollContainer>
			{Object.entries(data).map(([key, d]) => (
				<Accordion>
					<AccordionSummary
						key={key}
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header">
						<Typography>{key}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<ReactJson src={d} />
					</AccordionDetails>
				</Accordion>
			))}
		</Layout.ScrollContainer>
	);
}
