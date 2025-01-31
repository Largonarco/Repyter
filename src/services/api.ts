/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";

// Environment variables
const JUPYTERHUB_USERNAME = "admin";
const JUPYTERHUB_API_TOKEN = "api_token";
const JUPYTERHUB_API_BASE = `http://localhost:8000/user/${JUPYTERHUB_USERNAME}/api`;

// Helper for API requests
const jupyterFetch = async (endpoint: string, method: string, body?: any) => {
	const response = await fetch(`${JUPYTERHUB_API_BASE}${endpoint}`, {
		method,
		headers: {
			Authorization: `Token ${JUPYTERHUB_API_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	return response.json();
};

// File operations
export const fileAPI = {
	getFiles: () => jupyterFetch("/contents", "GET"),
	getFile: (path: string) => jupyterFetch(`/contents/${path}`, "GET"),
	createFile: async () => {
		return jupyterFetch(`/contents`, "POST", {
			type: "notebook",
		});
	},
	deleteFile: (path: string) => {
		return jupyterFetch(`/contents/${path}`, "DELETE");
	},
	renameFile: (oldPath: string, newPath: string) => {
		return jupyterFetch(`/contents/${oldPath}`, "PATCH", {
			path: newPath.includes(".ipynb") ? newPath : `${newPath}.ipynb`,
		});
	},
};

// Cell operations
export const cellAPI = {
	addCell: async (path: string, code: string) => {
		const notebook = await jupyterFetch(`/contents/${path}`, "GET");

		const cell_id = uuidv4();
		notebook.content.cells.push({
			outputs: [],
			metadata: {},
			source: code,
			id: cell_id,
			cell_type: "code",
			execution_count: null,
		});

		await jupyterFetch(`/contents/${path}`, "PUT", notebook);

		return cell_id;
	},
	updateCell: async (path: string, cellId: string, newCode: string) => {
		const notebook = await jupyterFetch(`/contents/${path}`, "GET");

		const cell = notebook.content.cells.find((c: any) => c.id === cellId);
		if (cell) cell.source = [newCode];

		return jupyterFetch(`/contents/${path}`, "PUT", notebook);
	},
	deleteCell: async (path: string, cellId: string) => {
		const notebook = await jupyterFetch(`/contents/${path}`, "GET");
		notebook.content.cells = notebook.content.cells.filter((c: any) => c.id !== cellId);

		return jupyterFetch(`/contents/${path}`, "PUT", notebook);
	},
};

// Kernel Execution
export class KernelSession {
	private kernelId: string = "";
	private messageQueue: any[] = [];
	private ws: WebSocket | null = null;
	private messageHandlers = new Map<string, Function>();

	private connectWebSocket() {
		this.ws = new WebSocket(
			`ws://localhost:8000/user/${JUPYTERHUB_USERNAME}/api/kernels/${this.kernelId}/channels?token=${JUPYTERHUB_API_TOKEN}`
		);

		this.ws.onopen = () => {
			this.messageQueue.forEach((msg) => this.ws?.send(JSON.stringify(msg)));
			this.messageQueue = [];
		};

		this.ws.onmessage = (event) => {
			if (event.data) {
				const msg = JSON.parse(event.data);

				const handler = this.messageHandlers.get(msg.msg_type);
				if (handler) handler(msg.content);
			}
		};
	}

	async initialize() {
		const kernel = await jupyterFetch("/kernels", "POST", {
			name: "python3",
			path: "admin",
		});
		this.kernelId = kernel.id;

		this.connectWebSocket();
	}

	execute(code: string) {
		const message = {
			metadata: {},
			parent_header: {},
			header: {
				version: "5.3",
				msg_id: uuidv4(),
				session: this.kernelId,
				msg_type: "execute_request",
				username: JUPYTERHUB_USERNAME,
			},
			content: {
				code,
				silent: false,
				allow_stdin: false,
				store_history: true,
				user_expressions: {},
			},
			channel: "shell",
		};

		return new Promise((resolve) => {
			this.messageHandlers.set("execute_result", (content: any) => {
				resolve({ status: "ok", output: content.data["text/plain"] });
			});
			this.messageHandlers.set("error", (content: any) => {
				resolve({
					status: "error",
					output: `${content.ename}: ${content.evalue}`,
				});
			});

			if (this.ws?.readyState === WebSocket.OPEN) {
				this.ws.send(JSON.stringify(message));
			} else {
				this.messageQueue.push(message);
			}
		});
	}
}
