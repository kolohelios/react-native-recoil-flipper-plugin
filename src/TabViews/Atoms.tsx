import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Typography,
} from '@material-ui/core';
import { usePlugin, useValue } from 'flipper-plugin';
import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactJson from 'react-json-view';

export default ({ plugin }: { plugin: any }) => {
	const instance = usePlugin(plugin);
	const data = useValue(instance.data);

	return (
		<>
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
		</>
	);
};
