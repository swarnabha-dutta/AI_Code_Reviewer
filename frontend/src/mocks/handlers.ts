import { http, HttpResponse } from "msw";

const API_URL = import.meta.env.VITE_API_URL;


export const handlers = [
    http.post(`${API_URL}/ai/get-review`, async () => {
        return HttpResponse.json({
            raw: "MSW Mock Review",
            cached: false,
        });
    }),
];