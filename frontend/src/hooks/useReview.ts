import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

interface ReviewState {
    code: string;
    review: string;
    isLoading: boolean;
    isCached: boolean;
    error: string;
    filesToUpload: File[];
}

export function useReview() {
    const { getToken, isLoaded, userId } = useAuth();
    const Backend_URL: string = import.meta.env.VITE_API_URL as string;

    const [state, setState] = useState<ReviewState>({
        code: `const sum = () => {\n    return 1 + 1;\n}`,
        review: "",
        isLoading: false,
        isCached: false,
        error: "",
        filesToUpload: [],
    });

    const setCode = (code: string) => setState(prev => ({ ...prev, code }));
    const setError = (error: string) => setState(prev => ({ ...prev, error }));
    const setFilesToUpload = (filesToUpload: File[]) => setState(prev => ({ ...prev, filesToUpload }));

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFiles = Array.from(event.target.files ?? []);
        setFilesToUpload(selectedFiles);

        if (selectedFiles.length === 0) return;

        const readers = selectedFiles.map(
            (file) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) =>
                    resolve(`\n\n### File: ${file.name} ###\n\n${e.target?.result}`);
                reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
                reader.readAsText(file);
            })
        );

        Promise.all(readers)
            .then((contents) =>
                setState(prev => ({ ...prev, code: prev.code + "\n" + contents.join("\n") }))
            )
            .catch((err: Error) => setError(`⚠️ ${err.message}`))
            .finally(() => (event.target.value = ""));
    };

    const reviewCode = async (): Promise<void> => {
        if (!isLoaded || !userId) {
            setError("⚠️ Please sign in first");
            return;
        }

        try {
            setState(prev => ({ ...prev, isLoading: true, error: "", review: "" }));

            if (state.filesToUpload.length === 0 && state.code.trim() === "") {
                setError("⚠️ write or upload code");
                return;
            }

            const formData = new FormData();

            if (state.filesToUpload.length > 0) {
                state.filesToUpload.forEach(file => formData.append("codeFiles", file));
            } else {
                formData.append("code", state.code.trim());
            }

            const token = await getToken();

            const response = await axios.post(
                `${Backend_URL}/ai/get-review`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );

            setState(prev => ({
                ...prev,
                review: response.data.raw ?? "",
                isCached: response.data.cached === true,
                filesToUpload: [],
            }));

        } catch (err) {
            const axiosError = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
            const msg = axiosError?.response?.data?.error || axiosError?.response?.data?.message || axiosError.message || "Server error";
            setError(msg);
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    return { ...state, setCode, setError, setFilesToUpload, handleFileChange, reviewCode };
}