/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { useNotebook } from "../hooks/useNotebook";
import { AiOutlineDelete, AiOutlinePlayCircle } from "react-icons/ai";
import { Textarea, Card, CardBody, CardFooter } from "@nextui-org/react";

interface CodeCellProps {
	id: string;
	code: string;
	output: any;
}

const CodeCell: React.FC<CodeCellProps> = ({ id, code, output }) => {
	const [cellCode, setCellCode] = useState(code);
	const { updateCell, deleteCell, executeCell } = useNotebook();

	const handleExecute = () => {
		executeCell(id);
	};

	const handleDelete = () => {
		deleteCell(id);
	};

	const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCellCode(event.target.value);
		updateCell(id, event.target.value);
	};

	return (
		<Card className="mb-4 border border-neutral-200 bg-neutral-">
			<CardBody className="relative">
				<Textarea
					value={cellCode}
					placeholder="Code here.. "
					className="font-mono text-sm"
					onChange={(e) => handleCodeChange(e)}
				/>

				<div className="absolute top-3 right-3 bg-neutral-50 justify-center items-center py-1 px-2 rounded-md flex ">
					<AiOutlinePlayCircle
						size={22}
						color="#171717"
						onClick={handleExecute}
						className="cursor-pointer hover:scale-110"
					/>

					<div className="h-[12px] w-[2px] mx-2  bg-neutral-400" />

					<AiOutlineDelete
						size={22}
						color="#171717"
						onClick={handleDelete}
						className="cursor-pointer hover:scale-110"
					/>
				</div>
			</CardBody>

			<CardFooter className="justify-between items-center bg-neutral-50">
				{output && (
					<pre
						className={`${
							output.status === "error" ? "text-red-400" : ""
						} bg-neutral-800 p-2 rounded mt-2 w-full overflow-x-auto text-sm`}>
						{output.output}
					</pre>
				)}
			</CardFooter>
		</Card>
	);
};

export default CodeCell;
