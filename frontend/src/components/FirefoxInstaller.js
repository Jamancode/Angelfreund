import React, { useState, useEffect } from 'react';

const FirefoxInstaller = ({ browserInfo, showInstallUI, onShowManual }) => {
  const [extensionAvailable, setExtensionAvailable] = useState(false);
  const [installationMethod, setInstallationMethod] = useState('extension');
  const [showFallbackOptions, setShowFallbackOptions] = useState(false);

  useEffect(() => {
    // Check if PWAsForFirefox extension is available
    const checkExtensionAvailability = async () => {
      try {
        // Try to communicate with the extension
        const response = await fetch('moz-extension://check-pwa-support', {
          method: 'GET',
          mode: 'no-cors'
        });
        setExtensionAvailable(true);
      } catch (error) {
        setExtensionAvailable(false);
      }
    };

    // Firefox mobile has different capabilities
    if (browserInfo.isAndroid) {
      setInstallationMethod('mobile');
    } else {
      checkExtensionAvailability();
    }
  }, [browserInfo]);

  const installWithExtension = async () => {
    try {
      // Communicate with PWAsForFirefox extension
      window.postMessage({
        type: 'INSTALL_PWA',
        manifest: '/manifest.json',
        name: 'Universal PWA Installer'
      }, '*');
    } catch (error) {
      console.error('Extension communication failed:', error);
      setShowFallbackOptions(true);
    }
  };

  const createDesktopShortcut = () => {
    const isLinux = navigator.platform.toLowerCase().includes('linux');
    const isWindows = navigator.platform.toLowerCase().includes('win');
    const isMac = navigator.platform.toLowerCase().includes('mac');

    if (isLinux) {
      // Create .desktop file for Linux
      const desktopEntry = `[Desktop Entry]
Version=1.0
Type=Application
Name=Universal PWA Installer
Comment=Universal PWA Installer
Exec=firefox --new-window "${window.location.href}"
Icon=${window.location.origin}/icons/icon-512x512.png
Categories=Utility;Network;
StartupWMClass=Firefox`;
      
      const blob = new Blob([desktopEntry], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pwa-installer.desktop';
      link.click();
      URL.revokeObjectURL(url);
    } else if (isWindows) {
      // Create batch file for Windows
      const batchContent = `@echo off
start firefox --new-window "${window.location.href}"`;
      
      const blob = new Blob([batchContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pwa-installer.bat';
      link.click();
      URL.revokeObjectURL(url);
    } else if (isMac) {
      // Create shell script for macOS
      const shellContent = `#!/bin/bash
open -a Firefox "${window.location.href}"`;
      
      const blob = new Blob([shellContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pwa-installer.command';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Firefox Mobile - has better PWA support
  if (browserInfo.isAndroid) {
    return (
      <div className="installation-strategy fade-in">
        <div className="strategy-icon">🦊📱</div>
        
        <h2 className="strategy-title">Firefox Android - Vollständige PWA-Unterstützung</h2>
        
        <p className="strategy-description">
          Firefox Android bietet hervorragende PWA-Unterstützung! Installation ähnlich wie Chrome.
        </p>

        <div className="firefox-mobile-guide">
          <h3>📋 Installation in Firefox Android</h3>
          
          <div className="installation-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Menü öffnen</h4>
                <p>Tippen Sie auf die drei Punkte (⋮) in der oberen rechten Ecke</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>"Installieren" auswählen</h4>
                <p>Wählen Sie "Installieren" oder "Zum Startbildschirm hinzufügen"</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Installation bestätigen</h4>
                <p>Bestätigen Sie die Installation im erscheinenden Dialog</p>
              </div>
            </div>
          </div>

          <div className="firefox-mobile-features">
            <h3>🚀 Firefox Android PWA-Features</h3>
            <ul>
              <li>📱 Vollständige PWA-Installation</li>
              <li>🔄 Service Worker Support</li>
              <li>💾 Offline-Funktionalität</li>
              <li>🔔 Push-Notifications (begrenzt)</li>
              <li>⚡ Native App-ähnliche Performance</li>
            </ul>
          </div>
        </div>

        <button className="install-button">
          📱 Jetzt in Firefox Android installieren
        </button>
      </div>
    );
  }

  // Firefox Desktop - requires extension or fallback
  return (
    <div className="installation-strategy fade-in">
      <div className="strategy-icon">🦊💻</div>
      
      <h2 className="strategy-title">Firefox Desktop - Extension oder Fallback</h2>
      
      <p className="strategy-description">
        Firefox Desktop unterstützt PWAs nicht nativ. Wir bieten Ihnen die besten Alternativen:
      </p>

      {/* Method Selection */}
      <div className="method-selection">
        <button 
          className={`method-button ${installationMethod === 'extension' ? 'active' : ''}`}
          onClick={() => setInstallationMethod('extension')}
        >
          🔧 Extension (Empfohlen)
        </button>
        <button 
          className={`method-button ${installationMethod === 'fallback' ? 'active' : ''}`}
          onClick={() => setInstallationMethod('fallback')}
        >
          🔗 Desktop-Shortcut
        </button>
      </div>

      {/* Extension Method */}
      {installationMethod === 'extension' && (
        <div className="firefox-extension-method">
          <div className="firefox-extension-card">
            <div className="extension-header">
              <div className="extension-icon">🔧</div>
              <div>
                <h3>PWAsForFirefox Extension</h3>
                <p>Die beste Lösung für Firefox Desktop PWAs</p>
              </div>
            </div>

            {extensionAvailable ? (
              <div className="extension-available">
                <div className="success-message">
                  <span>✅</span>
                  <p>PWAsForFirefox Extension erkannt!</p>
                </div>
                <button 
                  className="install-button"
                  onClick={installWithExtension}
                >
                  🚀 PWA mit Extension installieren
                </button>
              </div>
            ) : (
              <div className="extension-installation">
                <h4>🔧 Extension Installation</h4>
                <div className="installation-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Extension herunterladen</h4>
                      <p>Installieren Sie PWAsForFirefox aus dem Firefox Add-ons Store</p>
                      <a 
                        href="https://addons.mozilla.org/firefox/addon/pwas-for-firefox/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="install-button"
                      >
                        🔧 Extension installieren
                      </a>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Firefox neu starten</h4>
                      <p>Starten Sie Firefox nach der Installation neu</p>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Seite neu laden</h4>
                      <p>Laden Sie diese Seite neu für die PWA-Installation</p>
                      <button 
                        className="install-button secondary"
                        onClick={() => window.location.reload()}
                      >
                        🔄 Seite neu laden
                      </button>
                    </div>
                  </div>
                </div>

                <div className="extension-benefits">
                  <h4>✨ Extension Vorteile</h4>
                  <ul>
                    <li>📱 Echte PWA-Installation in Firefox</li>
                    <li>🏠 App-Icons im Startmenü/Desktop</li>
                    <li>⚡ Separater App-Prozess</li>
                    <li>🔄 Vollständiger Service Worker Support</li>
                    <li>📋 PWA-Management Interface</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fallback Method */}
      {installationMethod === 'fallback' && (
        <div className="firefox-fallback-method">
          <h3>🔗 Desktop-Shortcut Alternative</h3>
          <p>Erstellen Sie einen Desktop-Shortcut für schnellen Zugriff:</p>

          <div className="fallback-options">
            <div className="platform-detection">
              <h4>🖥️ Ihr System: {navigator.platform}</h4>
            </div>

            <div className="installation-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Shortcut erstellen</h4>
                  <p>Klicken Sie auf den Button für Ihr Betriebssystem:</p>
                  <button 
                    className="install-button"
                    onClick={createDesktopShortcut}
                  >
                    🔗 Desktop-Shortcut erstellen
                  </button>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Datei ausführbar machen</h4>
                  <p>Linux/macOS: Rechtklick → Eigenschaften → Berechtigung "Ausführbar" aktivieren</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Shortcut verwenden</h4>
                  <p>Doppelklick auf die erstellte Datei öffnet die App in Firefox</p>
                </div>
              </div>
            </div>
          </div>

          <div className="fallback-limitations">
            <h4>⚠️ Shortcut-Einschränkungen</h4>
            <ul>
              <li>🌐 Läuft weiterhin in Firefox-Browser</li>
              <li>📱 Kein echtes App-Icon im System</li>
              <li>🔄 Eingeschränkte Offline-Funktionalität</li>
              <li>🔔 Keine nativen Benachrichtigungen</li>
            </ul>
          </div>
        </div>
      )}

      {/* Additional Options */}
      <div className="firefox-additional-options">
        <h3>🔄 Weitere Optionen</h3>
        
        <div className="option-cards">
          <div className="option-card">
            <h4>📋 Als Lesezeichen speichern</h4>
            <p>Fügen Sie die Seite zur Lesezeichen-Symbolleiste hinzu</p>
            <button 
              className="install-button secondary"
              onClick={() => {
                if (window.sidebar && window.sidebar.addPanel) {
                  window.sidebar.addPanel('PWA Installer', window.location.href, '');
                } else {
                  alert('Drücken Sie Strg+D (Windows/Linux) oder Cmd+D (Mac) um ein Lesezeichen zu erstellen');
                }
              }}
            >
              📋 Lesezeichen erstellen
            </button>
          </div>

          <div className="option-card">
            <h4>🏠 Zur Startseite machen</h4>
            <p>Legen Sie diese Seite als Firefox-Startseite fest</p>
            <button 
              className="install-button secondary"
              onClick={() => {
                alert('Firefox Einstellungen → Allgemein → Startseite → Aktuelle Seite verwenden');
              }}
            >
              🏠 Startseite festlegen
            </button>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="firefox-troubleshooting">
        <details>
          <summary className="troubleshooting-header">
            🔧 Problembehebung
          </summary>
          <div className="troubleshooting-content">
            <div className="trouble-item">
              <strong>❓ Extension funktioniert nicht?</strong>
              <p>Stellen Sie sicher, dass Sie die neueste Version installiert haben und Firefox neugestartet wurde.</p>
            </div>
            <div className="trouble-item">
              <strong>⚠️ Shortcut startet nicht?</strong>
              <p>Überprüfen Sie die Dateiberechtigungen und stellen Sie sicher, dass Firefox korrekt installiert ist.</p>
            </div>
            <div className="trouble-item">
              <strong>🔄 Alternative Browser?</strong>
              <p>Für die beste PWA-Erfahrung empfehlen wir Chrome, Edge oder Firefox Mobile.</p>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default FirefoxInstaller;