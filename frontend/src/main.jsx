import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import { dark } from "@clerk/themes";

const PUBLISHABLE_KEY= import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if(!PUBLISHABLE_KEY){
  throw new Error("Missing Clerk Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
          publishableKey={PUBLISHABLE_KEY}
          appearance={{
            baseTheme: dark,
            variables:{
              colorText: "white",
              colorPrimary: "#15e7fa",
            },
            elements: {
              card: {
                backgroundColor: "#0d1117",
                color: "white"
              },
              headerTitle: {
                color: "white"
              },
              headerSubtitle: {
                color: "white"
              },
              socialButtonsBlockButtonText: {
                color: "white"
              },
              formFieldLabel: {
                color: "white"
              },
              formFieldInput: {
                color: "white",
                backgroundColor: "#1e1e1e",
                borderColor: "#333"
              },
              footerActionText: {
                color: "white"
              },
              footerActionLink: {
                color: "#4db8ff"
              }
            }
          }}
        >
          <App />
    </ClerkProvider>
  </StrictMode>,
)
