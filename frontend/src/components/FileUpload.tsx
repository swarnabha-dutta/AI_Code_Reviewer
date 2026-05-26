import React from 'react';

interface FileUploadProps {
    filesToUpload: File[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ filesToUpload, onChange }) => {
    return (
        <>
            <input
                type="file"
                id="file-upload"
                multiple
                onChange={onChange}
                accept=".js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.html,.css,.json"
                style={{ display: "none" }}
            />
            <label htmlFor="file-upload" className="app-button upload-label">
                {filesToUpload.length > 0
                    ? `Uploaded ${filesToUpload.length} file(s)`
                    : `Upload Files (Max 10MB)`}
            </label>
        </>
    );
};

export default FileUpload;