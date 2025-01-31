import React from "react";
import Notebook from "./pages/Notebook";

import { Routes, Route } from "react-router-dom";

const App: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Notebook />} />
		</Routes>
	);
};

export default App;
