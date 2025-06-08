import React, { useState } from 'react';

const FallbackInstaller = ({ browserInfo, showInstallUI, onShowManual }) => {
  const [selectedMethod, setSelectedMethod] = useState('bookmark');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const getBrowserSpecificGuidance = () => {
    const ua = navigator.userAgent;
    
    if (/OPR|Opera/.test(ua)) {
      return {
        name: 'Opera',
        icon: '🅾️',
        support: 'limited',
        guidance: 'Opera bietet eingeschränkte PWA-Unterstützung. Shortcuts werden erstellt, aber ohne vollständige App-Integration.'
      };
    } else if (/Edg/.test(ua) && browserInfo.isMobile) {
      return {
        name: 'Edge Mobile',
        icon: '🔷📱',
        support: 'good',
        guidance: 'Edge Mobile unterstützt PWAs ähnlich wie Chrome. Suchen Sie nach dem "Installieren" Symbol.'
      };
    } else if (/SamsungBrowser/.test(ua)) {
      return {
        name: 'Samsung Internet',
        icon: '📱⭐',
        support: 'good',
        guidance: 'Samsung Internet erstellt WebAPKs auf Samsung-Geräten, andernfalls Browser-Shortcuts.'
      };
    } else if (/UCBrowser/.test(ua)) {
      return {
        name: 'UC Browser',
        icon: '🦄',
        support: 'minimal',
        guidance: 'UC Browser hat minimale PWA-Unterstützung. Lesezeichen sind die beste Option.'
      };
    } else {
      return {
        name: 'Unbekannter Browser',
        icon: '🌐',
        support: 'unknown',
        guidance: 'Ihr Browser wurde nicht erkannt. Probieren Sie verschiedene Methoden aus.'
      };
    }
  };

  const browserGuidance = getBrowserSpecificGuidance();

  const createBookmark = () => {
    const title = 'Universal PWA Installer';
    const url = window.location.href;
    
    try {
      // Try different browser-specific bookmark methods
      if (window.sidebar && window.sidebar.addPanel) {
        // Firefox
        window.sidebar.addPanel(title, url, '');
      } else if (window.external && window.external.AddFavorite) {
        // Internet Explorer
        window.external.AddFavorite(url, title);
      } else {
        // Fallback: show instructions
        alert(`Lesezeichen erstellen:\n\n${getBookmarkInstructions()}`);
      }
    } catch (error) {
      alert(`Lesezeichen erstellen:\n\n${getBookmarkInstructions()}`);
    }
  };

  const getBookmarkInstructions = () => {
    const platform = navigator.platform.toLowerCase();
    const ua = navigator.userAgent;
    
    if (platform.includes('mac')) {
      return 'Drücken Sie Cmd+D oder verwenden Sie Menü → Lesezeichen → Seite zu Lesezeichen hinzufügen';
    } else if (platform.includes('win') || platform.includes('linux')) {
      return 'Drücken Sie Strg+D oder verwenden Sie Menü → Lesezeichen → Diese Seite zu Lesezeichen hinzufügen';
    } else if (/Mobi|Android/i.test(ua)) {
      return 'Tippen Sie auf das Menü (⋮) und wählen Sie "Lesezeichen hinzufügen" oder "Favorit hinzufügen"';
    } else {
      return 'Verwenden Sie Ihr Browser-Menü um ein Lesezeichen zu erstellen';
    }
  };

  const createHomeScreenShortcut = () => {
    if ('serviceWorker' in navigator) {
      // Try to trigger add to homescreen
      alert(`Home-Screen Shortcut:\n\n1. Öffnen Sie das Browser-Menü (⋮)\n2. Suchen Sie nach "Zum Startbildschirm hinzufügen" oder "Installieren"\n3. Folgen Sie den Anweisungen`);
    } else {
      alert('Ihr Browser unterstützt keine Home-Screen Shortcuts.');
    }
  };

  const downloadOfflineApp = () => {
    // Create a simple HTML file that can be saved locally
    const htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PWA Installer - Offline</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #0f3460 0%, #16213e 50%, #0a1a2e 100%);
            color: white;
            min-height: 100vh;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            text-align: center; 
        }
        .app-icon { 
            width: 100px; 
            height: 100px; 
            margin: 20px auto; 
            border-radius: 20px;
        }
        .btn { 
            display: inline-block; 
            padding: 10px 20px; 
            background: #3182ce; 
            color: white; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://raw.githubusercontent.com/Jamancode/jamancode.github.io/main/images/icon-128x128.png" 
             alt="PWA Installer" class="app-icon">
        <h1>🚀 Universal PWA Installer</h1>
        <p>Diese Offline-Version ermöglicht den lokalen Zugriff auf den PWA Installer.</p>
        <a href="${window.location.origin}" class="btn">🌐 Online-Version öffnen</a>
        <p>Speichern Sie diese Datei lokal für Offline-Zugriff!</p>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pwa-installer-offline.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="installation-strategy fade-in">
      <div className="strategy-icon">{browserGuidance.icon}</div>
      
      <h2 className="strategy-title">{browserGuidance.name} - Alternative Methoden</h2>
      
      <p className="strategy-description">
        {browserGuidance.guidance}
      </p>

      {/* Browser Compatibility Info */}
      <div className="browser-compatibility">
        <h3>🔍 Browser-Analyse</h3>
        <div className="compatibility-info">
          <div className="info-item">
            <span className="info-label">Browser:</span>
            <span className="info-value">{browserGuidance.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">PWA-Unterstützung:</span>
            <span className={`info-value support-${browserGuidance.support}`}>
              {browserGuidance.support === 'good' && '✅ Gut'}
              {browserGuidance.support === 'limited' && '⚠️ Begrenzt'}
              {browserGuidance.support === 'minimal' && '❌ Minimal'}
              {browserGuidance.support === 'unknown' && '❓ Unbekannt'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Service Worker:</span>
            <span className="info-value">
              {browserInfo.supportsServiceWorker ? '✅ Unterstützt' : '❌ Nicht unterstützt'}
            </span>
          </div>
        </div>
      </div>

      {/* Method Selection */}
      <div className="method-selection">
        <h3>📋 Verfügbare Methoden</h3>
        <div className="method-buttons">
          <button 
            className={`method-button ${selectedMethod === 'bookmark' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('bookmark')}
          >
            📋 Lesezeichen
          </button>
          <button 
            className={`method-button ${selectedMethod === 'homescreen' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('homescreen')}
          >
            🏠 Home-Screen
          </button>
          <button 
            className={`method-button ${selectedMethod === 'offline' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('offline')}
          >
            💾 Offline-Datei
          </button>
        </div>
      </div>

      {/* Bookmark Method */}
      {selectedMethod === 'bookmark' && (
        <div className="installation-method">
          <h3>📋 Lesezeichen-Installation</h3>
          <p>Die universellste Methode - funktioniert in fast allen Browsern:</p>
          
          <div className="installation-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Lesezeichen erstellen</h4>
                <p>Erstellen Sie ein Lesezeichen für schnellen Zugriff</p>
                <button className="install-button" onClick={createBookmark}>
                  📋 Lesezeichen erstellen
                </button>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Zur Symbolleiste hinzufügen</h4>
                <p>Ziehen Sie das Lesezeichen in die Lesezeichen-Symbolleiste für noch schnelleren Zugriff</p>
              </div>
            </div>
          </div>

          <div className="method-instructions">
            <h4>📱 Tastenkürzel</h4>
            <p>{getBookmarkInstructions()}</p>
          </div>
        </div>
      )}

      {/* Home Screen Method */}
      {selectedMethod === 'homescreen' && (
        <div className="installation-method">
          <h3>🏠 Home-Screen Installation</h3>
          <p>Versuchen Sie einen Shortcut auf dem Home-Screen zu erstellen:</p>
          
          <div className="installation-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Browser-Menü öffnen</h4>
                <p>Suchen Sie nach dem Menü-Symbol (⋮, ☰, oder ⚙️)</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Installation suchen</h4>
                <p>Suchen Sie nach Optionen wie:</p>
                <ul>
                  <li>"App installieren"</li>
                  <li>"Zum Startbildschirm hinzufügen"</li>
                  <li>"Add to Home Screen"</li>
                  <li>"Als App speichern"</li>
                </ul>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Installation bestätigen</h4>
                <p>Folgen Sie den Browser-spezifischen Anweisungen</p>
                <button className="install-button" onClick={createHomeScreenShortcut}>
                  🏠 Home-Screen Shortcut
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Method */}
      {selectedMethod === 'offline' && (
        <div className="installation-method">
          <h3>💾 Offline-Datei Installation</h3>
          <p>Laden Sie eine lokale HTML-Datei herunter, die als Startpunkt dient:</p>
          
          <div className="installation-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Offline-Datei herunterladen</h4>
                <p>Erstellen Sie eine lokale HTML-Datei mit Zugriff auf die Online-Version</p>
                <button className="install-button" onClick={downloadOfflineApp}>
                  💾 Offline-Datei erstellen
                </button>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Datei speichern</h4>
                <p>Speichern Sie die Datei an einem leicht auffindbaren Ort (z.B. Desktop)</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Shortcut erstellen</h4>
                <p>Erstellen Sie einen Desktop-Shortcut zur heruntergeladenen HTML-Datei</p>
              </div>
            </div>
          </div>

          <div className="offline-benefits">
            <h4>✨ Offline-Datei Vorteile</h4>
            <ul>
              <li>💾 Funktioniert ohne Internetverbindung als Startpunkt</li>
              <li>🖥️ Desktop-Shortcut möglich</li>
              <li>🔗 Direkter Link zur Online-Version</li>
              <li>📱 Universell kompatibel</li>
            </ul>
          </div>
        </div>
      )}

      {/* Advanced Options */}
      <div className="advanced-options">
        <button 
          className="install-button secondary"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          🔧 Erweiterte Optionen {showAdvancedOptions ? '▲' : '▼'}
        </button>
        
        {showAdvancedOptions && (
          <div className="advanced-content">
            <h3>🔧 Erweiterte Konfiguration</h3>
            
            <div className="advanced-grid">
              <div className="advanced-option">
                <h4>🌐 Als Startseite festlegen</h4>
                <p>Legen Sie diese Seite als Browser-Startseite fest für automatischen Zugriff</p>
                <button 
                  className="install-button secondary"
                  onClick={() => {
                    const instructions = navigator.userAgent.includes('Firefox') 
                      ? 'Firefox: Einstellungen → Allgemein → Startseite → Aktuelle Seite verwenden'
                      : 'Browser-Einstellungen → Startseite → Diese Seite verwenden';
                    alert(instructions);
                  }}
                >
                  🏠 Startseite konfigurieren
                </button>
              </div>

              <div className="advanced-option">
                <h4>📧 Link per E-Mail senden</h4>
                <p>Senden Sie sich den Link per E-Mail für späteren Zugriff</p>
                <button 
                  className="install-button secondary"
                  onClick={() => {
                    const subject = encodeURIComponent('Universal PWA Installer');
                    const body = encodeURIComponent(`Hier ist der Link zur PWA: ${window.location.href}`);
                    window.open(`mailto:?subject=${subject}&body=${body}`);
                  }}
                >
                  📧 E-Mail senden
                </button>
              </div>

              <div className="advanced-option">
                <h4>💬 Link teilen</h4>
                <p>Verwenden Sie die native Teilen-Funktion (falls verfügbar)</p>
                <button 
                  className="install-button secondary"
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: 'Universal PWA Installer',
                          text: 'Universaler PWA-Installer für alle Browser',
                          url: window.location.href,
                        });
                      } catch (error) {
                        console.log('Sharing failed:', error);
                      }
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href).then(() => {
                        alert('Link wurde in die Zwischenablage kopiert!');
                      });
                    }
                  }}
                >
                  💬 Link teilen
                </button>
              </div>

              <div className="advanced-option">
                <h4>🔄 Browser wechseln</h4>
                <p>Für die beste PWA-Erfahrung empfehlen wir einen unterstützten Browser</p>
                <div className="browser-recommendations">
                  <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer" className="browser-link">
                    🔵 Chrome herunterladen
                  </a>
                  <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer" className="browser-link">
                    🔷 Edge herunterladen
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compatibility Matrix */}
      <div className="compatibility-matrix">
        <h3>📊 Browser-Kompatibilität</h3>
        <div className="matrix-table">
          <div className="matrix-header">
            <span>Feature</span>
            <span>Status</span>
            <span>Alternative</span>
          </div>
          <div className="matrix-row">
            <span>Service Worker</span>
            <span className={browserInfo.supportsServiceWorker ? 'supported' : 'not-supported'}>
              {browserInfo.supportsServiceWorker ? '✅' : '❌'}
            </span>
            <span>Cache-Simulation</span>
          </div>
          <div className="matrix-row">
            <span>App Installation</span>
            <span className={browserInfo.hasBeforeInstallPrompt ? 'supported' : 'not-supported'}>
              {browserInfo.hasBeforeInstallPrompt ? '✅' : '❌'}
            </span>
            <span>Lesezeichen/Shortcuts</span>
          </div>
          <div className="matrix-row">
            <span>Offline-Modus</span>
            <span className={browserInfo.supportsServiceWorker ? 'supported' : 'not-supported'}>
              {browserInfo.supportsServiceWorker ? '✅' : '❌'}
            </span>
            <span>Lokale HTML-Datei</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackInstaller;