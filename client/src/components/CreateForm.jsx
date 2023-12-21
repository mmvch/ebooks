import { FormControl } from '@mui/base/FormControl';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React from 'react';

export default function CreateForm(props) {
	const [_title, setTitle] = React.useState('');
	const [_author, setAuthor] = React.useState('');

	const isFormValid = _title.trim() !== '' && _author.trim() !== '';

	const handleCreateBook = async () => {
		try {
			const response = await fetch('http://localhost:5500/books', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title: _title, author: _author }),
			});

			if (response.status === 201) {
				props.onUpdateTable();
			} else {
				console.error('Failed to create the book');
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}

		setTitle('');
		setAuthor('');
	};

	return (
		<Paper sx={
			{
				width: '50%',
				overflow: 'hidden',
				margin: '0 auto',
				marginBlock: '20px'
			}
		}>
			<Stack spacing={2} direction="row" sx={{ padding: '15px' }}>
				<FormControl>
					<TextField
						required
						value={_title}
						label="Titel"
						onChange={(e) => setTitle(e.target.value)}
					/>
				</FormControl>
				<FormControl>
					<TextField
						required
						value={_author}
						label="Author"
						onChange={(e) => setAuthor(e.target.value)}
					/>
				</FormControl>
				<Box sx={{ flex: 1 }}></Box>
				<Button onClick={() => handleCreateBook()} variant="outlined" disabled={!isFormValid} startIcon={<AddCircleOutlineIcon />}>
					Create
				</Button>
			</Stack>
		</Paper >
	);
}
