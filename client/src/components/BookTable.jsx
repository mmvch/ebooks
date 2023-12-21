import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from '@mui/icons-material/Update';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import React from 'react';

const columns = [
	{ id: 'title', label: 'Title' },
	{ id: 'author', label: 'Author' },
	{ id: 'action', label: 'Action' }
];

export default function BookTable(props) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [editingRow, setEditingRow] = React.useState(null);
	const [rows, setRows] = React.useState(props.data);

	const isFormValid = !!rows.find(book => book._id === editingRow?._id && book.title.trim() !== '' && book.author.trim() !== '');

	React.useEffect(() => {
		setRows(props.data);
	}, [props.data]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleEditBook = ({ _id, title, author }) => {
		setEditingRow({ _id, title, author });
	}

	const handleCancelEdit = () => {
		const updatedRows = rows.map(book => {
			if (book._id === editingRow._id) {
				return editingRow;
			}

			return book;
		});

		setRows(updatedRows);
		setEditingRow(null);
	}

	const handleFieldChange = (rowId, fieldId, value) => {
		const updatedRows = rows.map(book => {
			if (book._id === rowId) {
				return { ...book, [fieldId]: value };
			}

			return book;
		});

		setRows(updatedRows);
	};

	const handleDeleteBook = async (bookId) => {
		try {
			const response = await fetch(`http://localhost:5500/books/${bookId}`, {
				method: 'DELETE'
			});
			if (response.status === 200) {
				setRows(rows.filter(book => book._id !== bookId));
			} else {
				console.error('Failed to delete the book');
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	}

	const handleUpdateBook = async (book) => {
		try {
			const response = await fetch(`http://localhost:5500/books/${book._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title: book.title, author: book.author })
			});
			if (response.status === 200) {
				setEditingRow(null);
			} else {
				console.error('Failed to edit the book');
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	}

	return (
		<Paper sx={
			{
				width: '50%',
				overflow: 'hidden',
				margin: '0 auto'
			}
		}>
			<TableContainer>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align='center' sx={{ fontWeight: 'bold' }} >
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => (
								<TableRow key={row._id} hover>
									{columns.map((column) => (
										<TableCell key={column.id} sx={{ width: '35%' }}>
											{editingRow?._id === row._id ? (
												column.id === 'action' ? (
													<Stack spacing={2} direction="row">
														<Button onClick={handleCancelEdit} variant="outlined" startIcon={<CancelIcon />}>
															Cancel
														</Button>
														<Button onClick={() => handleUpdateBook(row)} disabled={!isFormValid} variant="outlined" startIcon={<UpdateIcon />}>
															Update
														</Button>
													</Stack>
												) : (
													<TextField
														value={row[column.id]}
														onChange={(e) => handleFieldChange(row._id, column.id, e.target.value)}
													/>
												)) : (
												column.id === 'action' ? (
													<Stack spacing={2} direction="row">
														<Button onClick={() => handleDeleteBook(row._id)} variant="outlined" startIcon={<DeleteIcon />}>
															Delete
														</Button>
														<Button onClick={() => handleEditBook(row)} variant="outlined" startIcon={<EditIcon />}>
															Edit
														</Button>
													</Stack>
												) : (
													row[column.id]
												)
											)}
										</TableCell>
									))}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
