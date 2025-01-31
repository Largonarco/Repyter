/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import CodeCell from "./CodeCell";
import { useNotebook } from "../hooks/useNotebook";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useState } from "react";

const FileEditor: React.FC = () => {
	const { currentFile, addCell, executeAll } = useNotebook();
	const [fileOuput, setFileOutput] = useState<{ status: string; output: string } | null>(null);

	const handleExecuteAll = async () => {
		const output = await executeAll();

		setFileOutput(output);
	};

	if (!currentFile.path) {
		return (
			<Card className="h-full">
				<CardBody className="flex justify-center items-center">
					<p className="text-center text-neutral-500">No file selected</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className="h-full">
			<CardHeader className="bg-primary-100 flex items-center justify-between">
				<h2 className="font-bold text-2xl text-primary-600">{currentFile.path}</h2>

				<AiOutlinePlayCircle size={30} onClick={handleExecuteAll} className="cursor-pointer hover:scale-110" />
			</CardHeader>

			<CardBody className="overflow-y-auto">
				{currentFile.cells.map((cell: any) => (
					<CodeCell key={cell.id} {...cell} />
				))}

				{fileOuput && (
					<pre
						className={`${
							fileOuput.status === "error" ? "text-red-400" : ""
						} p-2 rounded mt-2 w-full overflow-x-auto text-sm`}>
						{fileOuput.output}
					</pre>
				)}

				<Button color="secondary" onPress={addCell} className="mt-4">
					Add Cell
				</Button>
			</CardBody>
		</Card>
	);
};

export default FileEditor;
