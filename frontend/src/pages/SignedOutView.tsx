import React from 'react';
import { SignInButton } from '@clerk/clerk-react';

const SignedOutView: React.FC = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "20px",
            textAlign: "center"
        }}>
            <h1>🔐 AI Code Reviewer</h1>
            <p>Please sign in to start reviewing your code</p>
            <SignInButton mode="modal">
                <button className="app-button" style={{ padding: "12px 24px", fontSize: "16px" }}>
                    Sign In / Sign Up
                </button>
            </SignInButton>
        </div>
    );
};

export default SignedOutView;