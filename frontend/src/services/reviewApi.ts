import axios from "axios";

interface ReviewApiParams {
    backendUrl: string;
    token: string | null;
    formData: FormData;
}

export async function reviewApi({
    backendUrl,
    token,
    formData,
}: ReviewApiParams) {
    const response = await axios.post(
        `${backendUrl}/ai/get-review`,
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