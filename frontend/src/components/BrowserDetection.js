import React from 'react';

const BrowserDetection = ({ browserInfo }) => {
  if (!browserInfo) {
    return (
      <div className="browser-detection fade-in">
        <div className="browser-info">
          <div className="browser-icon">🔍</div>
          <div className="browser-details">
            <h3>Browser wird erkannt...</h3>
            <p>Analysiere Ihre Browser-Capabilities...</p>
          </div>
        </div>
      </div>
    );
  }

  const getBrowserIcon = () => {
    switch (browserInfo.name) {
      case 'chrome': return '🔵';
      case 'edge': return '🔷';
      case 'safari': return '🧭';
      case 'firefox': return '🦊';
      case 'samsung': return '📱';
      default: return '🌐';
    }
  };

  const getBrowserName = () => {
    switch (browserInfo.name) {
      case 'chrome': return 'Google Chrome';
      case 'edge': return 'Microsoft Edge';
      case 'safari': return 'Safari';
      case 'firefox': return 'Firefox';
      case 'samsung': return 'Samsung Internet';
      default: return 'Unbekannter Browser';
    }
  };

  const capabilities = [
    {
      name: 'Service Worker',
      supported: browserInfo.supportsServiceWorker,
      description: 'Offline-Funktionalität'
    },
    {
      name: 'Install Prompt',
      supported: browserInfo.hasBeforeInstallPrompt,
      description: 'Automatische Installation'
    },
    {
      name: 'Standalone Mode',
      supported: browserInfo.isStandalone,
      description: 'Bereits als PWA installiert'
    },
    {
      name: 'Mobile Platform',
      supported: browserInfo.isMobile,
      description: 'Mobile Optimierungen'
    }
  ];

  return (
    <div className="browser-detection fade-in">
      <h2>🔍 Browser-Erkennung</h2>
      
      <div className="browser-info">
        <div className="browser-icon">{getBrowserIcon()}</div>
        <div className="browser-details">
          <h3>{getBrowserName()}</h3>
          <p>{browserInfo.isMobile ? 'Mobile' : 'Desktop'} • {browserInfo.isIOS ? 'iOS' : browserInfo.isAndroid ? 'Android' : 'Desktop'}</p>
        </div>
      </div>

      <div className="browser-capabilities">
        {capabilities.map((capability, index) => (
          <div 
            key={index}
            className={`capability ${capability.supported ? 'supported' : 'not-supported'}`}
          >
            <span className="capability-icon">
              {capability.supported ? '✅' : '❌'}
            </span>
            <div>
              <strong>{capability.name}</strong>
              <br />
              <small>{capability.description}</small>
            </div>
          </div>
        ))}
      </div>

      {browserInfo.isStandalone && (
        <div className="standalone-notice">
          <span className="success-icon">🎉</span>
          <p><strong>Perfekt!</strong> Diese App läuft bereits als PWA!</p>
        </div>
      )}
    </div>
  );
};

export default BrowserDetection;