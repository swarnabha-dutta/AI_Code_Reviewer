import axios from "axios";

interface ReviewApiParams {
    backendUrl: string;
    token: string | null;
    formData: FormData;
}


interface ReviewApiParams {
    backendUrl: string;
    token: string | null;
    formData: FormData;
    query?: string;
}

export async function reviewApi({
    backendUrl,
    token,
    formData,
    query = "",
}: ReviewApiParams) {
    const response = await axios.post(
        `${backendUrl}/ai/get-review${query}`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
}