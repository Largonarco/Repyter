export interface CodeCell {
	id: string;
	content: string;
	output?: string;
	isExecuting: boolean;
}

export interface NotebookFile {
	id: string;
	name: string;
	cells: CodeCell[];
}
