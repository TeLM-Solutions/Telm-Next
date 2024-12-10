import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";

const uppyInit = (csrfToken, type) => {
    return new Uppy({
        restrictions: {
            maxNumberOfFiles: 1,
            allowedFileTypes: [
                'image/jpeg',
            ],
        },
        autoProceed: false,
    }).use(XHRUpload, {
        endpoint: process.env.NEXT_PUBLIC_BACKEND_URL + `/api/leads/upload`,
        formData: true,
        fieldName: 'file',
        withCredentials: true,
        limit: 1,
        headers: {
            'X-CSRF-TOKEN': csrfToken,
            // Other headers if needed
        },
    });
}
export default uppyInit