
import React from 'react';
import './LoadingModal.css';

export default function LoadingModal({ visible, message }) {
  if (!visible) return null;
  return (
    <div className="loading-backdrop">
      <div className="loading-modal">
        <p>{message}</p>
      </div>
    </div>
  );
}
