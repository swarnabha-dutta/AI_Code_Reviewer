import React from 'react';

interface CodeEditorProps {
    code: string;
    onChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
    return (
        <textarea
            className="code-editor"
            title="Code editor"
            value={code}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default CodeEditor;