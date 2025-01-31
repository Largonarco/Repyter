import "./index.css";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<NextUIProvider>
			<Router>
				<App />
			</Router>
		</NextUIProvider>
	</React.StrictMode>
);
