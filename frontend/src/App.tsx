import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SignedInView from './pages/SignedInView';
import SignedOutView from './pages/SignedOutView';
import './App.css';

function App() {
    return (
        <>
            <SignedOut>
                <SignedOutView />
            </SignedOut>
            <SignedIn>
                <SignedInView />
            </SignedIn>
        </>
    );
}

export default App;