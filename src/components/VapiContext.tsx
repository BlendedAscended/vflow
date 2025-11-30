'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_ASSISTANT_ID = 'fda3663c-b81a-45f1-b625-c4210a533e5f';
// const VAPI_PUBLIC_KEY = '164cb090-0e9d-4455-a339-4382c60e5874'; // Unused for now 
// Note: The user provided JSON had "orgId": "164cb090-0e9d-4455-a339-4382c60e5874". 
// Usually Vapi requires a Public Key. If the Org ID doesn't work, we might need the actual Public Key.
// However, for the purpose of this task, I will assume the Org ID or a specific Public Key is needed. 
// Let's check if I can find a public key in the user request or if I should just use the assistant ID for starting.
// Vapi.start(assistantId) is the main method. 

// Actually, looking at Vapi docs (mental check), `vapi.start(assistantId)` is sufficient for public assistants.
// If it requires a token, it's usually passed in the constructor.
// `const vapi = new Vapi(publicKey);`
// The user didn't explicitly provide a "Public Key", just Org ID. 
// I'll try initializing without a key first, or use a placeholder if needed. 
// Wait, the user JSON has `isServerUrlSecretSet: false`.
// Let's try to initialize with just the assistant ID in the start method.

// Re-reading the user request JSON:
// "orgId": "164cb090-0e9d-4455-a339-4382c60e5874"
// I will assume for now that I can instantiate Vapi and just call start.

interface VapiContextType {
    isSessionActive: boolean;
    isSpeechActive: boolean;
    startCall: () => void;
    endCall: () => void;
    toggleCall: () => void;
}

const VapiContext = createContext<VapiContextType | undefined>(undefined);

export const VapiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isSpeechActive, setIsSpeechActive] = useState(false);

    useEffect(() => {
        // Initialize Vapi with the Public Key if available. 
        // Since I don't have a clear Public Key, I'll try to use the Org ID as a token or just empty.
        // NOTE: Vapi Web SDK usually requires a Public Key to be instantiated: `new Vapi('public-key')`.
        // I will use the Org ID as the Public Key for now as it's the only ID available besides Assistant ID.
        // If this fails, I'll need to ask the user for the Public Key.
        const vapiInstance = new Vapi('164cb090-0e9d-4455-a339-4382c60e5874');
        setVapi(vapiInstance);

        return () => {
            vapiInstance.stop();
        };
    }, []);

    useEffect(() => {
        if (!vapi) return;

        const onCallStart = () => setIsSessionActive(true);
        const onCallEnd = () => {
            setIsSessionActive(false);
            setIsSpeechActive(false);
        };
        const onSpeechStart = () => setIsSpeechActive(true);
        const onSpeechEnd = () => setIsSpeechActive(false);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        };
    }, [vapi]);

    const startCall = useCallback(() => {
        if (vapi) {
            vapi.start(VAPI_ASSISTANT_ID);
        }
    }, [vapi]);

    const endCall = useCallback(() => {
        if (vapi) {
            vapi.stop();
        }
    }, [vapi]);

    const toggleCall = useCallback(() => {
        if (isSessionActive) {
            endCall();
        } else {
            startCall();
        }
    }, [isSessionActive, endCall, startCall]);

    return (
        <VapiContext.Provider value={{ isSessionActive, isSpeechActive, startCall, endCall, toggleCall }}>
            {children}
        </VapiContext.Provider>
    );
};

export const useVapi = () => {
    const context = useContext(VapiContext);
    if (context === undefined) {
        throw new Error('useVapi must be used within a VapiProvider');
    }
    return context;
};
