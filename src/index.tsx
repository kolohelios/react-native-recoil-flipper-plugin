import React from 'react';
import { PluginClient, createState } from 'flipper-plugin';
import TabController from './TabViews/TabController';
import { DeepDiff } from 'deep-diff';

const EXPECTED_API_VERSION = 0;

type Data = {
	key: string;
	message?: string | number;
};

type Events = {
	newRow: Data;
	apiVersion: Data;
};

const snapshotStore = {};

export function plugin(client: PluginClient<Events, {}>) {
	const data = createState<Record<string, Data>>({}, { persist: 'data' });

	client.onMessage('newRow', newRow => {
		data.update(draft => {
			draft[newRow.key] = newRow;
		});
		if (!snapshotStore[newRow.key]) {
			snapshotStore[newRow.key] = [];
		}
		snapshotStore[newRow.key][newRow.id] = newRow;
		console.log(DeepDiff(snapshotStore[newRow.key][newRow.id - 1], newRow));
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
	return <TabController plugin={plugin} />;
}
