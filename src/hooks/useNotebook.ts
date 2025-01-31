/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { fileAPI, cellAPI, KernelSession } from "../services/api";

interface NotebookState {
	files: string[];
	kernelSession: KernelSession | null;
	currentFile: { path: string | null; cells: { id: string; code: string; output: any }[] };
	addCell: () => void;
	loadFiles: () => Promise<void>;
	executeAll: () => Promise<any>;
	initializeKernel: () => Promise<void>;
	setCurrentFile: (name: string) => void;
	addFile: (name: string) => Promise<void>;
	executeCell: (id: string) => Promise<void>;
	deleteFile: (path: string) => Promise<void>;
	updateCell: (id: string, code: string) => void;
	deleteCell: (cell_id: string) => Promise<void>;
}

export const useNotebook = create<NotebookState>((set, get) => ({
	files: [],
	currentFile: { path: null, cells: [] },
	kernelSession: null,
	initializeKernel: async () => {
		if (!get().kernelSession) {
			const kernelSession = new KernelSession();
			await kernelSession.initialize();

			set({ kernelSession });
		}
	},
	addFile: async (name: string) => {
		const createdFile = await fileAPI.createFile();
		await fileAPI.renameFile(createdFile.name, name);

		await get().loadFiles();
	},
	loadFiles: async () => {
		const res = await fileAPI.getFiles();
		const files = res.content.map((file: any) => file.name);

		set({ files });
	},
	deleteFile: async (path: string) => {
		await fileAPI.deleteFile(path);
		await get().loadFiles();

		if (get().currentFile.path === path) {
			set({ currentFile: { path: null, cells: [] } });
		}
	},
	setCurrentFile: async (path: string) => {
		const res = await fileAPI.getFile(path);
		const notebookCells = res.content.cells.map((cell: { id: string; outputs: { text: any }[]; source: string[] }) => ({
			id: cell.id || Date.now().toString(),
			output: cell.outputs?.[0]?.text || "",
			code: Array.isArray(cell.source) ? cell.source.join("") : cell.source,
		}));

		set({
			currentFile: { path, cells: notebookCells },
		});
	},
	addCell: async () => {
		const currentFile = get().currentFile;

		if (currentFile.path) {
			const new_cell_id = await cellAPI.addCell(currentFile.path, "");

			set((state) => ({
				currentFile: {
					...state.currentFile,
					cells: [
						...state.currentFile.cells,
						{
							code: "",
							output: null,
							id: new_cell_id,
						},
					],
				},
			}));
		}
	},
	updateCell: async (cell_id, code) => {
		const currentFile = get().currentFile;

		if (currentFile.path) {
			await cellAPI.updateCell(currentFile.path, cell_id, code);

			set((state) => ({
				currentFile: {
					...state.currentFile,
					cells: state.currentFile.cells.map((cell) => (cell.id === cell_id ? { ...cell, code } : cell)),
				},
			}));
		}
	},
	deleteCell: async (cell_id: string) => {
		const currentFile = get().currentFile;

		if (currentFile.path) {
			await cellAPI.deleteCell(currentFile.path, cell_id);
			await get().setCurrentFile(currentFile.path);
		}
	},
	executeCell: async (cell_id) => {
		const kernelSession = get().kernelSession;
		const cell_e = get().currentFile.cells.find((cell) => cell.id === cell_id);

		if (cell_e && kernelSession) {
			try {
				const output = await kernelSession.execute(cell_e.code);

				set((state) => ({
					currentFile: {
						...state.currentFile,
						cells: state.currentFile.cells.map((cell) => (cell.id === cell_id ? { ...cell, output } : cell)),
					},
				}));
			} catch (error) {
				set((state) => ({
					currentFile: {
						...state.currentFile,
						cells: state.currentFile.cells.map((cell) =>
							cell.id === cell_id ? { ...cell, output: { status: "error", output: "Error executing cell!" } } : cell
						),
					},
				}));
			}
		}
	},
	executeAll: async () => {
		let code = "";
		const kernelSession = get().kernelSession;
		const currentCells = get().currentFile.cells;

		currentCells.forEach((cell) => (cell.code ? (code = code + "\n" + cell.code) : null));

		if (code && kernelSession) {
			try {
				const output = await kernelSession.execute(code);

				return output;
			} catch (error) {
				return { status: "error", output: "Error executing cell!" };
			}
		}
	},
}));
