import React from 'react';

// API Gate functionality has been removed to focus on the static experience.
// This component now acts as a simple pass-through wrapper.
interface ApiKeyGateProps {
  children: React.ReactNode;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ children }) => {
  return <>{children}</>;
};

export default ApiKeyGate;