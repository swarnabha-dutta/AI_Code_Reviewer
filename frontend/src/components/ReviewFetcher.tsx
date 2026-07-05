import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewFetcher() {
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const formData = new FormData();
            formData.append("code", "const a = 1;");

            const res = await axios.post(`${API_URL}/ai/get-review`, formData);

            setReview(res.data.raw);
            setLoading(false);
        }

        load();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return <p>{review}</p>;
}
