import React, { useEffect, useState } from 'react';

const InstallationSuccess = ({ browserInfo }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [appFeatures, setAppFeatures] = useState([]);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // Set browser-specific features
    const features = getBrowserSpecificFeatures();
    setAppFeatures(features);

    return () => clearTimeout(timer);
  }, [browserInfo]);

  const getBrowserSpecificFeatures = () => {
    const baseFeatures = [
      { icon: '🏠', title: 'Home-Screen Icon', description: 'App ist jetzt im Home-Screen verfügbar' },
      { icon: '⚡', title: 'Schneller Start', description: 'Lädt sofort ohne Browser-Overhead' },
      { icon: '💾', title: 'Offline-Fähig', description: 'Funktioniert auch ohne Internet' }
    ];

    if (browserInfo.isChrome || browserInfo.isEdge) {
      return [
        ...baseFeatures,
        { icon: '🔔', title: 'Push-Notifications', description: 'Benachrichtigungen direkt aufs Gerät' },
        { icon: '🔄', title: 'Background Sync', description: 'Synchronisation im Hintergrund' },
        { icon: '📱', title: 'WebAPK Integration', description: 'Native App-ähnliche Erfahrung' }
      ];
    } else if (browserInfo.isSafari) {
      return [
        ...baseFeatures,
        { icon: '🧭', title: 'Safari-Integration', description: 'Optimiert für iOS-Geräte' },
        { icon: '🔒', title: 'Sichere Ausführung', description: 'Läuft in sicherer Safari-Umgebung' }
      ];
    } else if (browserInfo.isFirefox) {
      return [
        ...baseFeatures,
        { icon: '🦊', title: 'Firefox-Optimiert', description: 'Beste Performance in Firefox' },
        { icon: '🔧', title: 'Extension-Support', description: 'Erweiterte Funktionen verfügbar' }
      ];
    } else {
      return baseFeatures;
    }
  };

  const getNextSteps = () => {
    if (browserInfo.isMobile) {
      return [
        '📱 App im Home-Screen finden',
        '🔍 App in der App-Übersicht suchen',
        '⚡ Direkter Start ohne Browser',
        '🔄 App kann offline genutzt werden'
      ];
    } else {
      return [
        '🖥️ App im Startmenü/Desktop finden',
        '📋 App in der Taskleiste verfügbar',
        '⚡ Eigenständiges App-Fenster',
        '🔄 Automatische Updates'
      ];
    }
  };

  const launchApp = () => {
    // Try to open the app in standalone mode
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      // Already in standalone mode
      window.location.reload();
    } else {
      // Try to trigger app launch
      window.open(window.location.href, '_blank');
    }
  };

  const shareSuccess = async () => {
    const shareData = {
      title: 'Universal PWA Installer',
      text: 'Ich habe gerade eine PWA installiert! 🚀',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Sharing failed:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const text = `Ich habe gerade eine PWA installiert! 🚀 ${window.location.href}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Link wurde in die Zwischenablage kopiert!');
      });
    } else {
      // Old-school fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link wurde in die Zwischenablage kopiert!');
    }
  };

  return (
    <div className="installation-success fade-in">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#3182ce', '#63b3ed', '#0bc5ea', '#38a169'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      {/* Success Icon */}
      <div className="success-icon">🎉</div>

      <h2 className="success-title">Installation Erfolgreich!</h2>

      <p className="success-description">
        Perfekt! Die PWA wurde erfolgreich installiert und ist jetzt als eigenständige App verfügbar.
        {browserInfo.isMobile ? ' Suchen Sie nach dem App-Icon auf Ihrem Home-Screen.' : ' Finden Sie die App in Ihrem Startmenü oder Desktop.'}
      </p>

      {/* Installation Details */}
      <div className="installation-details">
        <div className="detail-item">
          <span className="detail-icon">🖥️</span>
          <span>Browser: {browserInfo.name || 'Unbekannt'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">📱</span>
          <span>Plattform: {browserInfo.isMobile ? 'Mobile' : 'Desktop'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">⚡</span>
          <span>PWA-Modus: Aktiviert</span>
        </div>
      </div>

      {/* App Features */}
      <div className="app-features">
        <h3>✨ Verfügbare Features</h3>
        <div className="features-grid">
          {appFeatures.map((feature, index) => (
            <div key={index} className="feature-card success-feature">
              <div className="feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="next-steps">
        <h3>🚀 Nächste Schritte</h3>
        <div className="steps-list">
          {getNextSteps().map((step, index) => (
            <div key={index} className="step-item">
              <span className="step-check">✅</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="success-actions">
        <button className="install-button" onClick={launchApp}>
          🚀 App jetzt starten
        </button>

        <button className="install-button secondary" onClick={shareSuccess}>
          💬 Erfolg teilen
        </button>
      </div>

      {/* Additional Info */}
      <div className="additional-info">
        <details>
          <summary className="info-header">
            ℹ️ Weitere Informationen
          </summary>
          <div className="info-content">
            <h4>🔧 App-Verwaltung</h4>
            <ul>
              <li><strong>Updates:</strong> Die App aktualisiert sich automatisch bei neuen Versionen</li>
              <li><strong>Speicher:</strong> App-Daten werden lokal gespeichert für Offline-Nutzung</li>
              <li><strong>Deinstallation:</strong> {browserInfo.isMobile ? 'Langes Drücken auf das App-Icon → Entfernen' : 'Über Browser-Einstellungen oder App-Verwaltung'}</li>
              <li><strong>Einstellungen:</strong> PWA-spezifische Einstellungen in den Browser-Einstellungen</li>
            </ul>

            <h4>🆘 Support</h4>
            <p>Bei Problemen mit der installierten App:</p>
            <ul>
              <li>Laden Sie diese Seite im Browser neu</li>
              <li>Deinstallieren und neu installieren Sie die App</li>
              <li>Überprüfen Sie Ihre Internetverbindung für Updates</li>
            </ul>

            {browserInfo.isSafari && (
              <div className="ios-specific-info">
                <h4>🧭 iOS Safari Besonderheiten</h4>
                <ul>
                  <li>Cache-Limit: 50MB (gelegentliches Neuladen nötig)</li>
                  <li>Updates: Öffnen Sie gelegentlich in Safari für Updates</li>
                  <li>Navigation: Keine Browser-Buttons in der App</li>
                </ul>
              </div>
            )}
          </div>
        </details>
      </div>

      {/* Social Proof */}
      <div className="social-proof">
        <p>🎣 <em>Entwickelt für den Fangplaner - Ihr digitaler Angelfreund</em></p>
        <p>✨ PWA-Technologie für die beste mobile Erfahrung</p>
      </div>
    </div>
  );
};

export default InstallationSuccess;