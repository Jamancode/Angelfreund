import React, { useState, useEffect } from 'react';

const IOSInstaller = ({ browserInfo, showInstallUI, onShowManual }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvancedGuide, setShowAdvancedGuide] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Track visibility changes to detect share menu usage
    const handleVisibilityChange = () => {
      if (document.hidden && currentStep === 1) {
        // User probably opened share menu
        setCurrentStep(2);
      } else if (!document.hidden && currentStep === 2) {
        // User came back, might have completed installation
        setTimeout(() => {
          if (!window.navigator.standalone) {
            setCurrentStep(3); // Show final step
          }
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check if coming back from potential installation
    window.addEventListener('focus', () => {
      if (window.navigator.standalone) {
        setIsVisible(true);
      }
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentStep]);

  const createIOSShortcut = () => {
    const shortcutData = {
      "WFWorkflowActions": [
        {
          "WFWorkflowActionIdentifier": "is.workflow.actions.openurl",
          "WFWorkflowActionParameters": {
            "WFInput": window.location.href
          }
        },
        {
          "WFWorkflowActionIdentifier": "is.workflow.actions.share",
          "WFWorkflowActionParameters": {
            "WFShareActionExtensionName": "Add to Home Screen"
          }
        }
      ],
      "WFWorkflowName": "PWA Installer",
      "WFWorkflowIcon": {
        "WFWorkflowIconGlyphNumber": 59511
      }
    };

    const shortcutURL = `shortcuts://import-workflow/?url=${encodeURIComponent(
      'data:application/json;base64,' + btoa(JSON.stringify(shortcutData))
    )}`;

    return shortcutURL;
  };

  const getIOSVersion = () => {
    const match = navigator.userAgent.match(/OS (\d+)_/);
    return match ? parseInt(match[1]) : 0;
  };

  const hasShortcutsApp = () => {
    return getIOSVersion() >= 12; // Shortcuts app available from iOS 12
  };

  return (
    <div className="installation-strategy fade-in">
      <div className="strategy-icon">🧭</div>

      <h2 className="strategy-title">iOS Safari - Manuelle Installation</h2>

      <p className="strategy-description">
        Apple Safari erfordert eine manuelle Installation über das Teilen-Menü.
        Folgen Sie der interaktiven Anleitung unten:
      </p>

      {/* iOS Version and Capabilities Info */}
      <div className="ios-info">
        <h3>📱 Ihr iOS-Gerät</h3>
        <p>iOS Version: {getIOSVersion()}+ • {browserInfo.isMobile ? 'Mobile' : 'Desktop'}</p>
        <div className="ios-capabilities">
          <div className={`capability ${getIOSVersion() >= 14 ? 'supported' : 'not-supported'}`}>
            <span>📲</span>
            <span>PWA-Unterstützung: {getIOSVersion() >= 14 ? 'Vollständig' : 'Begrenzt'}</span>
          </div>
          <div className={`capability ${hasShortcutsApp() ? 'supported' : 'not-supported'}`}>
            <span>🔗</span>
            <span>Shortcuts App: {hasShortcutsApp() ? 'Verfügbar' : 'Nicht verfügbar'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Guide */}
      <div className="ios-guide">
        <h3>📋 Interaktive Installation</h3>

        <div className="installation-steps">
          {/* Step 1: Share Button */}
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Teilen-Symbol antippen</h4>
              <p>Tippen Sie auf das Teilen-Symbol unten in Safari</p>
              <div className="step-visual">
                <div className="safari-toolbar">
                  <div className="toolbar-buttons">
                    <span>◄</span>
                    <span>►</span>
                  </div>
                  <div className="url-bar">🔒 PWA Installer</div>
                  <div className="share-icon-highlight">📤</div>
                </div>
                <div className="arrow-indicator">
                  <span style={{fontSize: '2rem', color: 'var(--accent-cyan)'}}>⬆️</span>
                  <p>Hier tippen!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Add to Home Screen */}
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>"Zum Home-Bildschirm" finden</h4>
              <p>Scrollen Sie in den Optionen nach unten und wählen Sie "Zum Home-Bildschirm"</p>
              <div className="step-visual">
                <div className="ios-share-options">
                  <div className="share-option">✈️ AirDrop</div>
                  <div className="share-option">💬 Nachrichten</div>
                  <div className="share-option">📧 Mail</div>
                  <div className="share-option highlighted">📱 Zum Home-Bildschirm</div>
                  <div className="share-option">📋 Link kopieren</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Confirm Installation */}
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Installation bestätigen</h4>
              <p>Überprüfen Sie den App-Namen und tippen Sie "Hinzufügen"</p>
              <div className="step-visual">
                <div className="ios-confirmation">
                  <img
                    src="https://raw.githubusercontent.com/Jamancode/jamancode.github.io/main/images/icon-72x72.png"
                    alt="App Icon"
                    style={{width: '60px', height: '60px', borderRadius: '12px'}}
                  />
                  <h4>PWA Installer</h4>
                  <p>Zum Home-Bildschirm hinzufügen</p>
                  <button className="ios-add-button">Hinzufügen</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Shortcuts Alternative */}
      {hasShortcutsApp() && (
        <div className="ios-shortcuts-section">
          <h3>🔗 iOS Shortcuts Alternative</h3>
          <p>Für eine noch einfachere Installation können Sie einen iOS Shortcut verwenden:</p>

          <a
            href={createIOSShortcut()}
            className="install-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 iOS Shortcut erstellen
          </a>

          <div className="shortcuts-explanation">
            <h4>So funktioniert's:</h4>
            <ol>
              <li>Shortcut wird in der Shortcuts-App installiert</li>
              <li>Führen Sie den Shortcut aus</li>
              <li>Automatische Navigation zum Teilen-Menü</li>
              <li>Ein Tap auf "Zum Home-Bildschirm"</li>
            </ol>
          </div>
        </div>
      )}

      {/* iOS Limitations Notice */}
      <div className="ios-limitations">
        <h3>ℹ️ iOS PWA-Besonderheiten</h3>
        <div className="limitation-grid">
          <div className="limitation-item">
            <span className="limitation-icon">💾</span>
            <div>
              <strong>50MB Cache-Limit</strong>
              <p>Begrenzte Offline-Speicherung</p>
            </div>
          </div>
          <div className="limitation-item">
            <span className="limitation-icon">🔔</span>
            <div>
              <strong>Push-Notifications</strong>
              <p>Seit iOS 16.4 verfügbar</p>
            </div>
          </div>
          <div className="limitation-item">
            <span className="limitation-icon">🧭</span>
            <div>
              <strong>Nur Safari</strong>
              <p>PWA-Installation nur in Safari möglich</p>
            </div>
          </div>
          <div className="limitation-item">
            <span className="limitation-icon">🔄</span>
            <div>
              <strong>Cache-Updates</strong>
              <p>Gelegentliches Neuladen erforderlich</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Troubleshooting */}
      <div className="ios-troubleshooting">
        <button
          className="install-button secondary"
          onClick={() => setShowAdvancedGuide(!showAdvancedGuide)}
        >
          🔧 Erweiterte Hilfe {showAdvancedGuide ? '▲' : '▼'}
        </button>

        {showAdvancedGuide && (
          <div className="advanced-guide">
            <h4>Problembehebung</h4>
            <div className="troubleshooting-items">
              <div className="trouble-item">
                <strong>❓ "Zum Home-Bildschirm" nicht sichtbar?</strong>
                <p>Stellen Sie sicher, dass Sie Safari verwenden (nicht Chrome oder Firefox). Die Option ist nur in Safari verfügbar.</p>
              </div>
              <div className="trouble-item">
                <strong>⚠️ App startet nicht richtig?</strong>
                <p>Löschen Sie die App vom Homescreen und wiederholen Sie den Installationsprozess. Stellen Sie sicher, dass Sie eine stabile Internetverbindung haben.</p>
              </div>
              <div className="trouble-item">
                <strong>🔄 App zeigt veraltete Inhalte?</strong>
                <p>Öffnen Sie die App, wischen Sie nach unten zum Aktualisieren oder öffnen Sie sie kurz in Safari und installieren Sie neu.</p>
              </div>
              <div className="trouble-item">
                <strong>📱 Icon sieht falsch aus?</strong>
                <p>Dies kann bei schlechter Internetverbindung während der Installation passieren. Neuinstallation empfohlen.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Installation Button */}
      <div className="installation-test">
        <button
          className="install-button"
          onClick={() => {
            setCurrentStep(1);
            // Scroll to top to restart the guide
            window.scrollTo({top: 0, behavior: 'smooth'});
          }}
        >
          🔄 Anleitung neu starten
        </button>
      </div>
    </div>
  );
};

export default IOSInstaller;