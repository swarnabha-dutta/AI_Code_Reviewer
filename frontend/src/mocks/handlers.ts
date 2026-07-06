
import { http, HttpResponse } from "msw";

const API_URL = import.meta.env.VITE_API_URL;










/* ----------------------------------------------------------
   Values captured from the latest intercepted request
---------------------------------------------------------- */

export let lastAuthorizationHeader: string | null = null;
export let lastContentTypeHeader: string | null = null;
export let lastRequestBody: FormData | null = null;
export let lastQueryParams: URLSearchParams | null = null;

/* ----------------------------------------------------------
   Helper
---------------------------------------------------------- */

export function resetCapturedRequest() {
    lastAuthorizationHeader = null;
    lastContentTypeHeader = null;
    lastRequestBody = null;
    lastQueryParams = null;
}

/* ----------------------------------------------------------
   MSW Handlers
---------------------------------------------------------- */

export const handlers = [
    http.post(`${API_URL}/ai/get-review`, async ({ request }) => {
        // Capture Headers
        lastAuthorizationHeader =
            request.headers.get("Authorization");

        lastContentTypeHeader =
            request.headers.get("Content-Type");

        // Capture FormData
        lastRequestBody = await request.formData();

        // Capture Query Parameters
        const url = new URL(request.url);
        lastQueryParams = url.searchParams;

        return HttpResponse.json({
            raw: "MSW Mock Review",
            cached: false,
        });
    }),
];