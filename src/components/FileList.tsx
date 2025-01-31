import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNotebook } from "../hooks/useNotebook";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineFileAdd, AiOutlineDelete } from "react-icons/ai";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, ModalContent } from "@nextui-org/react";

const schema = z.object({
	fileName: z.string().min(1, "File name is required"),
});

type FormData = z.infer<typeof schema>;

const FileList: React.FC = () => {
	const [fileToDelete, setFileToDelete] = useState<string | null>(null);
	const [isDelFileModalOpen, setIsDelFileModalOpen] = useState<boolean>(false);
	const [isAddFileModalOpen, setIsAddFileModalOpen] = useState<boolean>(false);
	const { files, loadFiles, addFile, deleteFile, setCurrentFile, currentFile } = useNotebook();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const handleAddFile = async (data: FormData) => {
		await addFile(data.fileName);

		reset();
		setIsAddFileModalOpen(false);
	};

	const handleDeleteFile = async (path: string) => {
		setFileToDelete(path);
		setIsDelFileModalOpen(true);
	};

	const confirmDelete = async () => {
		if (fileToDelete) {
			await deleteFile(fileToDelete);

			setFileToDelete(null);
			setIsDelFileModalOpen(false);
		}
	};

	useEffect(() => {
		loadFiles();
	}, [loadFiles]);

	return (
		<div className="h-full relative bg-neutral-800 shadow-md rounded-lg p-4">
			<h3 className="mb-4 font-semibold text-lg text-primary-600">Files</h3>

			<div className="space-y-2">
				{files.map((file) => (
					<div key={file} className="flex items-center gap-2">
						<Button
							className="w-full justify-start"
							onPress={() => setCurrentFile(file)}
							color={currentFile.path === file ? "secondary" : "primary"}
							variant={currentFile.path === file ? "flat" : "light"}>
							{file}
						</Button>

						<Button color="danger" variant="bordered" size="sm" onPress={() => handleDeleteFile(file)}>
							<AiOutlineDelete />
						</Button>
					</div>
				))}
			</div>

			<Button
				color="primary"
				onPress={() => setIsAddFileModalOpen(true)}
				className="absolute bottom-[16px] gap-2 items-center justify-center">
				<AiOutlineFileAdd size={20} />
			</Button>

			<Modal
				hideCloseButton={true}
				isOpen={isAddFileModalOpen}
				className="bg-neutral-800 rounded-lg border border-neutral-700"
				onClose={() => setIsAddFileModalOpen(false)}>
				<ModalContent>
					<form onSubmit={handleSubmit(handleAddFile)}>
						<ModalHeader>Add New File</ModalHeader>

						<ModalBody>
							<Input
								{...register("fileName")}
								placeholder="Enter file name"
								errorMessage={errors.fileName?.message}
								className="border border-neutral-500 rounded-md"
							/>
						</ModalBody>

						<ModalFooter>
							<Button type="submit">Add File</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>

			<Modal
				hideCloseButton={true}
				isOpen={isDelFileModalOpen}
				className="bg-neutral-800 rounded-lg border border-neutral-700"
				onClose={() => setIsDelFileModalOpen(false)}>
				<ModalContent>
					<ModalHeader>Alert!</ModalHeader>

					<ModalBody>Are you sure you want to delete this file?</ModalBody>

					<ModalFooter>
						<Button color="danger" onPress={confirmDelete}>
							Delete
						</Button>
						<Button onPress={() => setIsDelFileModalOpen(false)}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default FileList;
