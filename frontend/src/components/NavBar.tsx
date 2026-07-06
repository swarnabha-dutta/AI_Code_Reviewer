import React from 'react';
import type { BaseTheme } from '@clerk/types';
import { UserButton } from '@clerk/clerk-react';

interface NavBarProps {
    theme: string;
    onToggleTheme: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ theme, onToggleTheme }) => {
    return (
        <nav
            aria-label="Application navigation"
            style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 1000,
                display: "flex",
                gap: "10px",
                alignItems: "center",
            }}
        >
            <button onClick={onToggleTheme} className="theme-toggle">
                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
            </button>
            <UserButton
                afterSignOutUrl="/"
                appearance={{
                    baseTheme: "dark" as unknown as BaseTheme,
                    elements: {
                        userButtonPopoverCard: { backgroundColor: "#0d1117", color: "white" },
                        userButtonPopoverActionButton: { color: "white" },
                        userButtonPopoverActionButtonIcon: { color: "white" },
                        userButtonPopoverFooter: { color: "white" },
                        userButtonPopoverHeaderTitle: { color: "white" },
                        userButtonPopoverHeaderSubtitle: { color: "#cfcfcf" },
                    },
                }}
            />
        </nav>
    );
};

export default NavBar;