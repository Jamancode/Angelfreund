import React, { useState, useEffect } from 'react';
import './App.css';

// Universal PWA Installer Components
import BrowserDetection from './components/BrowserDetection';
import ChromeInstaller from './components/ChromeInstaller';
import IOSInstaller from './components/IOSInstaller';
import FirefoxInstaller from './components/FirefoxInstaller';
import FallbackInstaller from './components/FallbackInstaller';
import InstallationSuccess from './components/InstallationSuccess';

function App() {
  const [browserInfo, setBrowserInfo] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installationStrategy, setInstallationStrategy] = useState(null);
  const [showInstallUI, setShowInstallUI] = useState(false);

  // Browser detection and PWA capability analysis
  useEffect(() => {
    const detectBrowser = () => {
      const ua = navigator.userAgent;
      const info = {
        name: 'unknown',
        isChrome: /Chrome/.test(ua) && !/Edge|Edg/.test(ua),
        isEdge: /Edge|Edg/.test(ua),
        isSafari: /Safari/.test(ua) && !/Chrome|Chromium/.test(ua),
        isFirefox: /Firefox/.test(ua),
        isSamsung: /SamsungBrowser/.test(ua),
        isIOS: /iPad|iPhone|iPod/.test(ua),
        isAndroid: /Android/.test(ua),
        isMobile: /Mobi|Android/i.test(ua),
        hasBeforeInstallPrompt: 'BeforeInstallPromptEvent' in window,
        supportsServiceWorker: 'serviceWorker' in navigator,
        isStandalone: false
      };

      // Determine browser name
      if (info.isChrome) info.name = 'chrome';
      else if (info.isEdge) info.name = 'edge';
      else if (info.isSafari) info.name = 'safari';
      else if (info.isFirefox) info.name = 'firefox';
      else if (info.isSamsung) info.name = 'samsung';

      // Check if already installed (PWA mode)
      info.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone ||
                         document.referrer.includes('android-app://');

      return info;
    };

    const browser = detectBrowser();
    setBrowserInfo(browser);
    setIsInstalled(browser.isStandalone);

    // Determine installation strategy
    if (browser.isStandalone) {
      setInstallationStrategy('already-installed');
    } else if (browser.hasBeforeInstallPrompt && (browser.isChrome || browser.isEdge || browser.isSamsung)) {
      setInstallationStrategy('automatic');
    } else if (browser.isIOS && browser.isSafari) {
      setInstallationStrategy('ios-manual');
    } else if (browser.isFirefox && !browser.isAndroid) {
      setInstallationStrategy('firefox-desktop');
    } else {
      setInstallationStrategy('fallback');
    }
  }, []);

  // Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Handle beforeinstallprompt event (Chrome/Edge)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallUI(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallUI(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle installation for automatic browsers
  const handleInstall = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    console.log('Install result:', result);

    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setShowInstallUI(false);
    }

    setInstallPrompt(null);
  };

  // Show manual installation UI
  const showManualInstall = () => {
    setShowInstallUI(true);
  };

  // Render appropriate installation component
  const renderInstallationComponent = () => {
    if (!browserInfo) return <div>Browser wird erkannt...</div>;

    if (isInstalled) {
      return <InstallationSuccess browserInfo={browserInfo} />;
    }

    switch (installationStrategy) {
      case 'automatic':
        return (
          <ChromeInstaller
            browserInfo={browserInfo}
            installPrompt={installPrompt}
            onInstall={handleInstall}
            showInstallUI={showInstallUI}
            onShowManual={showManualInstall}
          />
        );
      case 'ios-manual':
        return (
          <IOSInstaller
            browserInfo={browserInfo}
            showInstallUI={showInstallUI}
            onShowManual={showManualInstall}
          />
        );
      case 'firefox-desktop':
        return (
          <FirefoxInstaller
            browserInfo={browserInfo}
            showInstallUI={showInstallUI}
            onShowManual={showManualInstall}
          />
        );
      default:
        return (
          <FallbackInstaller
            browserInfo={browserInfo}
            showInstallUI={showInstallUI}
            onShowManual={showManualInstall}
          />
        );
    }
  };

  return (
    <div className="App">
      {/* Water Animation Background */}
      <div className="water-bg"></div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <img
            src="https://raw.githubusercontent.com/Jamancode/jamancode.github.io/main/images/icon-72x72.png"
            alt="PWA Installer Icon"
            className="app-icon"
          />
          <div className="header-text">
            <h1>Universal PWA Installer</h1>
            <p>Verwandelt Web-Apps in native App-Erfahrungen</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Browser Detection Display */}
        <BrowserDetection browserInfo={browserInfo} />

        {/* Installation Component */}
        <div className="installation-container">
          {renderInstallationComponent()}
        </div>

        {/* Features Section */}
        <section className="features-section">
          <h2>🚀 PWA Vorteile</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Native App-Gefühl</h3>
              <p>Läuft wie eine echte App mit eigenem Icon im Homescreen</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Blitzschnell</h3>
              <p>Startet sofort ohne Browser-Overhead</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Offline-Fähig</h3>
              <p>Funktioniert auch ohne Internetverbindung</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Push-Benachrichtigungen</h3>
              <p>Bleiben Sie über wichtige Updates informiert</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Lokale Datenspeicherung</h3>
              <p>Ihre Daten bleiben auch offline verfügbar</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Plattform-optimiert</h3>
              <p>Perfekt angepasst für jeden Browser und jedes Gerät</p>
            </div>
          </div>
        </section>

        {/* Browser Support Matrix */}
        <section className="browser-support">
          <h2>🌐 Browser-Unterstützung</h2>
          <div className="support-matrix">
            <div className="browser-support-item chrome">
              <div className="browser-icon">🔵</div>
              <h4>Chrome</h4>
              <div className="support-level excellent">Exzellent</div>
              <p>Automatische Installation mit erweiterten Features</p>
            </div>
            <div className="browser-support-item edge">
              <div className="browser-icon">🔷</div>
              <h4>Edge</h4>
              <div className="support-level excellent">Exzellent</div>
              <p>Vollständige PWA-Unterstützung wie Chrome</p>
            </div>
            <div className="browser-support-item safari">
              <div className="browser-icon">🧭</div>
              <h4>Safari</h4>
              <div className="support-level good">Gut</div>
              <p>Manuelle Installation über "Zum Home-Bildschirm"</p>
            </div>
            <div className="browser-support-item firefox">
              <div className="browser-icon">🦊</div>
              <h4>Firefox</h4>
              <div className="support-level limited">Begrenzt</div>
              <p>Desktop: Extension erforderlich, Mobile: Vollständig</p>
            </div>
            <div className="browser-support-item samsung">
              <div className="browser-icon">📱</div>
              <h4>Samsung Internet</h4>
              <div className="support-level good">Gut</div>
              <p>WebAPK-Unterstützung auf Samsung-Geräten</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2025 Universal PWA Installer - Powered by React & Service Workers</p>
        <p>🎣 Ursprünglich entwickelt für den Fangplaner</p>
      </footer>
    </div>
  );
}

export default App;