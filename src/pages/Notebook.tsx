import { useEffect } from "react";
import FileList from "../components/FileList";
import FileEditor from "../components/FileEditor";
import { useNotebook } from "../hooks/useNotebook";

const Notebook: React.FC = () => {
	const { initializeKernel } = useNotebook();

	useEffect(() => {
		initializeKernel();
	}, [initializeKernel]);

	return (
		<div className="flex gap-4 w-screen h-screen p-4 bg-neutral-900">
			<div className="w-1/4 h-full">
				<FileList />
			</div>
			<div className="w-3/4">
				<FileEditor />
			</div>
		</div>
	);
};

export default Notebook;
