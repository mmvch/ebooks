import React from 'react';
import BookTable from './BookTable';
import CreateForm from './CreateForm';

function App() {
	const [tableData, setTableData] = React.useState([]);

	React.useEffect(() => {
		updateTable()
	}, []);

	const updateTable = () => {
		fetch('http://localhost:5500/books', {
			method: 'GET',
		})
			.then(response => response.json())
			.then(data => setTableData(data))
			.catch(error => console.error("Fetch Error: ", error));
	};

	return (
		<div className="App">
			<CreateForm onUpdateTable={updateTable} />
			<BookTable data={tableData} />
		</div>
	);
}

export default App;
