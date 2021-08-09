import React from 'react';
import {
	PluginClient,
	usePlugin,
	createState,
	useValue,
	Layout,
} from 'flipper-plugin';

const EXPECTED_API_VERSION = 0;

type Data = {
	id: string;
	message?: string | number;
};

type Events = {
	newRow: Data;
	apiVersion: Data;
};

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, {}>) {
	const data = createState<Record<string, Data>>({}, { persist: 'data' });

	client.onMessage('newRow', newRow => {
		data.update(draft => {
			draft[newRow.id] = newRow;
		});
		console.log(newRow);
	});

	client.onMessage('apiVersion', ({ message }) => {
		console.log({ message });
		if(message > EXPECTED_API_VERSION) {
			console.error('The instance of react-native-recoil-flipper-client installed in the app is sending using a newer data API version than expected; please update this Flipper plugin.');
		}
		if(message < EXPECTED_API_VERSION) {
			console.error('The instance of react-native-recoil-flipper-client installed in the app is sending using an older data API version than expected; please update react-native-recoil-flipper-client.');
		}
		if (message === EXPECTED_API_VERSION) {
			// responder.success({ ack: true });
		}
	})

	client.addMenuEntry({
		action: 'clear',
		handler: async () => {
			data.set({});
		},
	});

	return { data };
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
	const instance = usePlugin(plugin);
	const data = useValue(instance.data);

	return (
		<h1>Hello!</h1>
		// <Layout.ScrollContainer>
		// 	{Object.entries(data).map(([id, d]) => (
		// 		<pre key={id} data-testid={id}>
		// 			{JSON.stringify(d)}
		// 		</pre>
		// 	))}
		// </Layout.ScrollContainer>
	);
}
