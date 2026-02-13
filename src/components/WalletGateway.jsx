import React, { useState, useEffect } from 'react';

const WalletGateway = ({ onConnect }) => {
    const [error, setError] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);

    const connectWallet = async () => {
        setIsConnecting(true);
        setError('');

        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    onConnect(accounts[0]);
                } else {
                    setError('No accounts found. Please unlock MetaMask.');
                }
            } catch (err) {
                if (err.code === 4001) {
                    setError('Connection rejected by user.');
                } else {
                    setError('Failed to connect. Please try again.');
                    console.error(err);
                }
            }
        } else {
            setError('MetaMask not detected! Please install the extension.');
        }
        setIsConnecting(false);
    };

    return (
        <div className="gateway-container">
            <div className="gateway-card">
                <h2>🔒 Access Restricted</h2>
                <p>Please connect your Ethereum wallet (MetaMask) to verify you are human and access the Movie Finder.</p>

                {error && <div className="error-message">{error}</div>}

                <button
                    className="btn connect-btn"
                    onClick={connectWallet}
                    disabled={isConnecting}
                >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>

                {typeof window.ethereum === 'undefined' && (
                    <p className="install-link">
                        <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
                            Install MetaMask
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
};

export default WalletGateway;
