import React, {useEffect, useRef} from 'react';
import Uppy from '@uppy/core';
import {XHRUpload} from '@uppy/xhr-upload';

const UppyDocuments = ({onUploadComplete}) => {
    const uppyDocumentsRef = useRef(null);

    useEffect(() => {
        if (!uppyDocumentsRef.current) {
            uppyDocumentsRef.current = new Uppy({
                restrictions: {
                    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                },
                autoProceed: false,
            });

            uppyDocumentsRef.current.use(XHRUpload, {
                endpoint: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/executives/documents',
                formData: true,
                fieldName: 'file',
                withCredentials: true,
                bundle: true,
                headers: {
                    'X-CSRF-TOKEN': CSRF,
                },
            });

            uppyDocumentsRef.current.on('complete', (result) => {
                // Handle upload completion here and call onUploadComplete callback
                onUploadComplete(result);
            });
        }
    }, [onUploadComplete]);

    return (
        <div>

            <button onClick={() => uppyDocumentsRef.current.upload()}>Upload Files</button>
        </div>
    );
};

export default UppyDocuments;