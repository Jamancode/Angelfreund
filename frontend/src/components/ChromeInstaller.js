import React, { useState, useEffect } from 'react';

const ChromeInstaller = ({ browserInfo, installPrompt, onInstall, showInstallUI, onShowManual }) => {
  const [engagementScore, setEngagementScore] = useState(0);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [installationStep, setInstallationStep] = useState('ready');

  useEffect(() => {
    // Engagement tracking - smart timing for install prompt
    const trackEngagement = () => {
      setEngagementScore(prev => prev + 1);
    };

    // Track meaningful interactions
    document.addEventListener('click', trackEngagement);
    document.addEventListener('scroll', trackEngagement);

    return () => {
      document.removeEventListener('click', trackEngagement);
      document.removeEventListener('scroll', trackEngagement);
    };
  }, []);

  useEffect(() => {
    // Show install prompt after 3 meaningful interactions
    if (engagementScore >= 3 && installPrompt && !showCustomPrompt) {
      setShowCustomPrompt(true);
    }
  }, [engagementScore, installPrompt, showCustomPrompt]);

  const handleInstallClick = async () => {
    setInstallationStep('installing');
    
    try {
      await onInstall();
      setInstallationStep('success');
    } catch (error) {
      console.error('Installation failed:', error);
      setInstallationStep('error');
    }
  };

  const getBrowserSpecificFeatures = () => {
    if (browserInfo.isEdge) {
      return [
        '🔧 Edge-spezifische PWA-Features',
        '📱 Integration in Windows-Startmenü',
        '🔄 Automatische Updates über Windows Store',
        '🎛️ Erweiterte Browser-Integration'
      ];
    }
    
    return [
      '📲 Automatische Installation verfügbar',
      '🚀 Chrome WebAPK-Technologie',
      '🔔 Rich Push-Notifications',
      '⚡ Instant-Loading mit Service Workers',
      '📊 Erweiterte Web-APIs'
    ];
  };

  if (installationStep === 'success') {
    return (
      <div className="installation-strategy slide-up">
        <div className="success-icon">🎉</div>
        <h2 className="success-title">Installation Erfolgreich!</h2>
        <p className="success-description">
          Die PWA wurde erfolgreich installiert und ist jetzt in Ihrem App-Menü verfügbar.
        </p>
        <div className="install-benefits">
          <h3>✨ Jetzt verfügbar:</h3>
          <ul>
            <li>🏠 Icon im Homescreen/Startmenü</li>
            <li>⚡ Direkter Start ohne Browser</li>
            <li>🔄 Offline-Funktionalität</li>
            <li>🔔 Push-Benachrichtigungen</li>
          </ul>
        </div>
      </div>
    );
  }

  if (installationStep === 'error') {
    return (
      <div className="installation-strategy">
        <div className="strategy-icon">❌</div>
        <h2 className="strategy-title">Installation Fehlgeschlagen</h2>
        <p className="strategy-description">
          Die automatische Installation konnte nicht abgeschlossen werden.
        </p>
        <button 
          className="install-button secondary"
          onClick={() => setInstallationStep('ready')}
        >
          🔄 Erneut versuchen
        </button>
        <button 
          className="install-button secondary"
          onClick={onShowManual}
        >
          📖 Manuelle Anleitung
        </button>
      </div>
    );
  }

  return (
    <div className="installation-strategy fade-in">
      <div className="strategy-icon">
        {browserInfo.isEdge ? '🔷' : '🔵'}
      </div>
      
      <h2 className="strategy-title">
        {browserInfo.isEdge ? 'Microsoft Edge' : 'Google Chrome'} - Automatische Installation
      </h2>
      
      <p className="strategy-description">
        Ihr Browser unterstützt die automatische PWA-Installation mit erweiterten Features!
      </p>

      {/* Engagement-based Smart Prompt */}
      {(showCustomPrompt || showInstallUI) && installPrompt && (
        <div className="chrome-install-prompt">
          <div className="prompt-content">
            <h3>🚀 App installieren?</h3>
            <p>Installieren Sie diese App für die beste Erfahrung:</p>
            
            <ul className="install-benefits">
              {getBrowserSpecificFeatures().map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <div className="prompt-actions">
              <button 
                className="install-button"
                onClick={handleInstallClick}
                disabled={installationStep === 'installing'}
              >
                {installationStep === 'installing' ? (
                  <>⏳ Installiere...</>
                ) : (
                  <>📲 Jetzt installieren</>
                )}
              </button>
              
              <button 
                className="install-button secondary"
                onClick={() => setShowCustomPrompt(false)}
              >
                ⏳ Später
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Installation Option */}
      {!installPrompt && (
        <div className="no-prompt-fallback">
          <p>⚠️ Der automatische Installationsprompt ist noch nicht verfügbar.</p>
          <p>Dies kann passieren wenn:</p>
          <ul>
            <li>Die App bereits installiert ist</li>
            <li>Browser-Engagement-Kriterien noch nicht erfüllt sind</li>
            <li>PWA-Manifest-Validierung läuft</li>
          </ul>
          
          <button className="install-button" onClick={onShowManual}>
            📖 Manuelle Installation
          </button>
        </div>
      )}

      {/* Chrome-specific Installation Steps */}
      {!showCustomPrompt && !installPrompt && (
        <div className="chrome-manual-steps">
          <h3>📋 Manuelle Installation für Chrome/Edge:</h3>
          <div className="installation-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Adressleiste prüfen</h4>
                <p>Suchen Sie nach dem "Installieren" Symbol (⬇️ oder +) in der Adressleiste</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Browser-Menü nutzen</h4>
                <p>Alternativ: Drei-Punkte-Menü → "App installieren" oder "Zum Startbildschirm hinzufügen"</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Installation bestätigen</h4>
                <p>Klicken Sie "Installieren" im erscheinenden Dialog</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Chrome Features Info */}
      <div className="advanced-features">
        <h3>⚡ Erweiterte Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <div>
              <strong>Background Sync</strong>
              <p>Synchronisation auch im Hintergrund</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔔</span>
            <div>
              <strong>Rich Notifications</strong>
              <p>Erweiterte Push-Benachrichtigungen</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <div>
              <strong>WebAPK Integration</strong>
              <p>Native App-ähnliche Integration</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <div>
              <strong>Instant Loading</strong>
              <p>Sofortiger Start ohne Browser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChromeInstaller;