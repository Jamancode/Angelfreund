document.addEventListener('DOMContentLoaded', () => {
    // Existing browser detection code from the previous step...
    const browserInfoDisplay = document.getElementById('browser-info-display');
    const browserNameEl = document.getElementById('browser-name');
    const browserPlatformEl = document.getElementById('browser-platform');
    const browserLogoEl = document.getElementById('browser-logo');
    const featureChecksEl = document.getElementById('feature-checks');

    function detectBrowser() {
        const ua = navigator.userAgent;
        const info = {
            name: 'unknown',
            version: '',
            isChrome: /Chrome/.test(ua) && !/Edge|Edg|OPR/.test(ua),
            isEdge: /Edge|Edg/.test(ua),
            isSafari: /Safari/.test(ua) && !/Chrome|Chromium|CriOS/.test(ua),
            isFirefox: /Firefox|FxiOS/.test(ua),
            isOpera: /OPR|Opera/.test(ua),
            isSamsung: /SamsungBrowser/.test(ua),
            isIOS: /iPad|iPhone|iPod/.test(ua) && !window.MSStream,
            isAndroid: /Android/.test(ua),
            isMobile: /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            hasBeforeInstallPrompt: false,
            supportsServiceWorker: 'serviceWorker' in navigator,
            isStandalone: false
        };

        let temp;
        let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
            info.name = 'IE';
            info.version = temp[1] || '';
        }
        if (M[1] === 'Chrome') {
            temp = ua.match(/\b(OPR|Edge|Edg)\/(\d+)/);
            if (temp != null) {
                const browserFullName = temp.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg', 'Edge');
                const parts = browserFullName.split(' ');
                info.name = parts[0].toLowerCase();
                info.version = parts[1];
            }
        }
        if (!info.name || info.name === 'unknown' || info.name === 'chrome') {
            if (info.isEdge) info.name = 'edge';
            else if (info.isOpera) info.name = 'opera';
            else if (info.isSamsung) info.name = 'samsung';
            else if (info.isFirefox) info.name = 'firefox';
            else if (info.isSafari && !info.isChrome) info.name = 'safari';
            else if (info.isChrome) info.name = 'chrome';
        }

        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((temp = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, temp[1]);

        if(info.name !== 'IE' && M[0] && M[1]){
          if(!info.version) info.version = M[1];
        }

        info.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           window.navigator.standalone ||
                           document.referrer.includes('android-app://');

        if (info.isIOS && /FxiOS/.test(ua)) {
            info.name = 'firefox';
            info.isSafari = false;
        }
        if (info.isIOS && /CriOS/.test(ua)) {
            info.name = 'chrome';
            info.isSafari = false;
        }

        return info;
    }

    const browser = detectBrowser();
    window.detectedBrowserInfo = browser;

    // This function is from the previous step, kept for context if needed by other functions.
    // It's not directly called in this version of the script but was part of the previous setup.
    function logBrowserInfo() {
        const browserDetails = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            vendor: navigator.vendor,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: typeof navigator.hardwareConcurrency !== 'undefined' ? navigator.hardwareConcurrency : 'N/A',
            maxTouchPoints: typeof navigator.maxTouchPoints !== 'undefined' ? navigator.maxTouchPoints : 'N/A',
            online: navigator.onLine,
            screenWidth: window.screen ? window.screen.width : undefined,
            screenHeight: window.screen ? window.screen.height : undefined,
            screenAvailWidth: window.screen ? window.screen.availWidth : undefined,
            screenAvailHeight: window.screen ? window.screen.availHeight : undefined,
            screenColorDepth: window.screen ? window.screen.colorDepth : undefined,
            screenPixelDepth: window.screen ? window.screen.pixelDepth : undefined,
            windowInnerWidth: window.innerWidth,
            windowInnerHeight: window.innerHeight,
            windowOuterWidth: window.outerWidth,
            windowOuterHeight: window.outerHeight,
            timestamp: new Date().toISOString(),
            detectedName: browser.name,
            detectedVersion: browser.version,
            isMobile: browser.isMobile,
            isIOS: browser.isIOS,
            isAndroid: browser.isAndroid,
            supportsServiceWorker: browser.supportsServiceWorker,
            isStandalone: browser.isStandalone
        };
        console.log('Browser Info (Extended):', browserDetails);
    }
    logBrowserInfo(); // Call it to log the initial detected info

    function setBrowserLogo(name) {
        let logoSrc = 'images/browser-placeholder.png';
        switch (name) {
            case 'chrome':    logoSrc = 'images/chrome-logo.png'; break;
            case 'firefox':   logoSrc = 'images/firefox-logo.png'; break;
            case 'edge':      logoSrc = 'images/edge-logo.png'; break;
            case 'safari':    logoSrc = 'images/safari-logo.png'; break;
            case 'opera':     logoSrc = 'images/opera-logo.png'; break;
            case 'samsung':   logoSrc = 'images/samsung-internet-logo.png'; break;
            default:          logoSrc = 'images/browser-placeholder.png';
        }
        if (browserLogoEl) browserLogoEl.src = logoSrc;
        if (browserLogoEl && name !== 'unknown') browserLogoEl.alt = name + " Logo";
    }

    if (browserNameEl) browserNameEl.textContent = browser.name.charAt(0).toUpperCase() + browser.name.slice(1) + (browser.version ? ' ' + browser.version : '');
    if (browserPlatformEl) {
        let platform = browser.isMobile ? 'Mobile' : 'Desktop';
        if (browser.isIOS) platform += ' (iOS)';
        else if (browser.isAndroid) platform += ' (Android)';
        browserPlatformEl.textContent = platform;
    }
    setBrowserLogo(browser.name);

    if (featureChecksEl) {
        featureChecksEl.innerHTML = `
            <div class="feature-check-item ${browser.supportsServiceWorker ? 'supported' : 'not-supported'}">
                <span class="status-icon">${browser.supportsServiceWorker ? '✅' : '❌'}</span>
                <div>
                    <strong>Service Worker</strong>
                    <p>Offline-Funktionalität</p>
                </div>
            </div>
            <div class="feature-check-item ${browser.hasBeforeInstallPrompt ? 'supported' : 'not-supported'}" id="feature-install-prompt">
                <span class="status-icon">${browser.hasBeforeInstallPrompt ? '✅' : '❓'}</span>
                <div>
                    <strong>Install Prompt</strong>
                    <p>Automatische Installation</p>
                </div>
            </div>
            <div class="feature-check-item ${browser.isStandalone ? 'supported' : 'not-supported'}">
                <span class="status-icon">${browser.isStandalone ? '✅' : '❌'}</span>
                <div>
                    <strong>Standalone Mode</strong>
                    <p>Bereits als PWA installiert</p>
                </div>
            </div>
            <div class="feature-check-item ${browser.isMobile ? 'supported' : 'not-supported'}">
                <span class="status-icon">${browser.isMobile ? '✅' : '❌'}</span>
                <div>
                    <strong>Mobile Platform</strong>
                    <p>Mobile Optimierungen</p>
                </div>
            </div>
        `;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredInstallPrompt = e;
        window.detectedBrowserInfo.hasBeforeInstallPrompt = true;

        const installPromptFeatureEl = document.getElementById('feature-install-prompt');
        if (installPromptFeatureEl) {
            installPromptFeatureEl.classList.remove('not-supported');
            installPromptFeatureEl.classList.add('supported');
            installPromptFeatureEl.querySelector('.status-icon').textContent = '✅';
        }

        const chromeInstallBtn = document.getElementById('chrome-install-btn');
        if(chromeInstallBtn && (window.detectedBrowserInfo.name === 'chrome' || window.detectedBrowserInfo.name === 'edge' || window.detectedBrowserInfo.name === 'samsung')){
            chromeInstallBtn.style.display = 'inline-flex';
             // Show install instructions paragraph as well
            const chromeInstallInstructions = document.getElementById('chrome-install-instructions');
            if (chromeInstallInstructions) {
                chromeInstallInstructions.style.display = 'block';
            }
        }
        console.log('beforeinstallprompt event gefangen. App kann installiert werden.');
        // Update installation strategy display after prompt is detected
        displayInstallationStrategy();
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA wurde installiert');
        window.detectedBrowserInfo.isStandalone = true;
        const standaloneFeatureEl = document.querySelector('#feature-checks .feature-check-item:nth-child(3)'); // Target the div
        if(standaloneFeatureEl){
             standaloneFeatureEl.querySelector('.status-icon').textContent = '✅';
             standaloneFeatureEl.classList.remove('not-supported');
             standaloneFeatureEl.classList.add('supported');
        }
        displayInstallationStrategy(); // Update UI to show success message
    });

    // NEUER CODE HIER:
    function displayInstallationStrategy() {
        const browser = window.detectedBrowserInfo;
        let strategy = 'fallback'; // Default Strategie

        if (browser.isStandalone) {
            strategy = 'already-installed';
        } else if (browser.hasBeforeInstallPrompt && (browser.name === 'chrome' || browser.name === 'edge' || browser.name === 'samsung' || (browser.name === 'opera' && browser.isAndroid) )) { // Opera Android might support it
            strategy = 'automatic';
        } else if (browser.isIOS && browser.name === 'safari') {
            strategy = 'ios-manual';
        } else if (browser.name === 'firefox' && !browser.isMobile) { // Firefox Desktop
            strategy = 'firefox-desktop';
        } else if (browser.name === 'firefox' && browser.isMobile) { // Firefox Mobile (Android or iOS)
             // Firefox on Android supports "Add to Home screen" from menu
             // Firefox on iOS uses Safari's engine, so manual via share like Safari
            strategy = browser.isAndroid ? 'firefox-android' : 'ios-manual'; // Treat Fx iOS like Safari for install
        }
        // Weitere spezifische Fälle könnten hier hinzugefügt werden, z.B. für Opera.

        console.log('Determined installation strategy:', strategy);
        console.log('Browser details for strategy:', browser);


        // Alle Installer-Sektionen ausblenden
        const installerSections = document.querySelectorAll('.installer-section');
        installerSections.forEach(section => section.style.display = 'none');

        // Die Haupt-Installations-Area leeren oder ausblenden, wenn eine spezifische Sektion gezeigt wird
        const installationArea = document.getElementById('installation-area');
        if (installationArea) {
            installationArea.innerHTML = ''; // Inhalt leeren
            installationArea.style.display = 'none'; // Oder ganz ausblenden
        }

        // Ziel-Sektion basierend auf Strategie auswählen und anzeigen
        let targetSectionId = '';
        switch (strategy) {
            case 'already-installed':
                targetSectionId = 'installation-success-section';
                break;
            case 'automatic':
                targetSectionId = 'chrome-installer-section'; // Diese Sektion ist für Chrome, Edge, Samsung, Opera (Android)
                const chromeInstallBtn = document.getElementById('chrome-install-btn');
                const chromeInstallInstructions = document.getElementById('chrome-install-instructions');
                if(chromeInstallBtn){
                    chromeInstallBtn.style.display = window.deferredInstallPrompt ? 'inline-flex' : 'none';
                }
                if(chromeInstallInstructions){
                    chromeInstallInstructions.style.display = 'block'; // Always show instructions if automatic is the strategy
                }
                break;
            case 'ios-manual':
                targetSectionId = 'ios-installer-section';
                // If it's Firefox on iOS, adjust title/text slightly if needed
                if (browser.name === 'firefox' && browser.isIOS) {
                    const iosSectionTitle = document.querySelector('#ios-installer-section h2');
                    if (iosSectionTitle) iosSectionTitle.innerHTML = `<span class="icon">📱</span> Firefox auf iOS - Manuelle Installation`;
                }
                break;
            case 'firefox-desktop':
                targetSectionId = 'firefox-fallback-section';
                break;
            case 'firefox-android':
                // For Firefox Android, we can use a modified version of the fallback or a new specific section.
                // For now, let's assume we want to prompt them to use the "Add to Home Screen" feature from the menu.
                // We can reuse the fallback section and customize its content or create a new one.
                // Let's try to customize the fallback section for this.
                targetSectionId = 'fallback-installer-section';
                const fallbackTitle = document.querySelector('#fallback-installer-section h2');
                const fallbackText = document.querySelector('#fallback-installer-section p');
                const fallbackBookmarkBtn = document.getElementById('fallback-bookmark-btn');
                const fallbackHomescreenBtn = document.getElementById('fallback-homescreen-btn');
                const fallbackOfflineFileBtn = document.getElementById('fallback-offline-file-btn');

                if (fallbackTitle) fallbackTitle.innerHTML = `<img src="images/firefox-logo.png" alt="Firefox Logo" class="section-icon"> Firefox Mobile - Installation`;
                if (fallbackText) fallbackText.textContent = 'Du kannst diese App zu deinem Startbildschirm hinzufügen für ein App-ähnliches Erlebnis:';

                if(fallbackHomescreenBtn) {
                    fallbackHomescreenBtn.innerHTML = '<span class="icon">➕</span> Zum Startbildschirm hinzufügen (via Menü)';
                    fallbackHomescreenBtn.style.display = 'inline-flex';
                    // Potentially add specific instructions for Firefox Android menu
                    let instructionsEl = document.getElementById('firefox-android-instructions');
                    if (!instructionsEl && fallbackText) {
                        instructionsEl = document.createElement('p');
                        instructionsEl.id = 'firefox-android-instructions';
                        instructionsEl.innerHTML = `Öffne das Firefox-Menü (oft drei Punkte <span style="font-weight:bold; font-size:1.2em;">⋮</span>) und wähle <strong style="color: var(--text-accent);">'Zum Startbildschirm hinzufügen'</strong> oder <strong style="color: var(--text-accent);">'Seite installieren'</strong>.`;
                        fallbackText.parentNode.insertBefore(instructionsEl, fallbackText.nextSibling);
                    }
                }
                if(fallbackBookmarkBtn) fallbackBookmarkBtn.style.display = 'none'; // Hide other generic options
                if(fallbackOfflineFileBtn) fallbackOfflineFileBtn.style.display = 'none';
                break;
            case 'fallback':
            default:
                targetSectionId = 'fallback-installer-section';
                const defaultFallbackTitle = document.querySelector('#fallback-installer-section h2');
                const defaultFallbackText = document.querySelector('#fallback-installer-section p');
                const defaultfallbackBookmarkBtn = document.getElementById('fallback-bookmark-btn');
                const defaultfallbackHomescreenBtn = document.getElementById('fallback-homescreen-btn');
                const defaultfallbackOfflineFileBtn = document.getElementById('fallback-offline-file-btn');
                if (defaultFallbackTitle) defaultFallbackTitle.innerHTML = `<span class="icon">❓</span> Andere Browser - Manuelle Optionen`;
                if (defaultFallbackText) defaultFallbackText.textContent = 'Ihr Browser unterstützt möglicherweise keine direkte PWA-Installation. Hier sind einige Alternativen:';
                if(defaultfallbackBookmarkBtn) defaultfallbackBookmarkBtn.style.display = 'inline-flex';
                if(defaultfallbackHomescreenBtn) defaultfallbackHomescreenBtn.style.display = 'inline-flex';
                if(defaultfallbackOfflineFileBtn) defaultfallbackOfflineFileBtn.style.display = 'inline-flex';

                break;
        }

        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        } else if (installationArea && strategy !== 'already-installed') {
            // If no specific section found (except success), show the general installation-area with a message
            installationArea.innerHTML = '<p>Lade Installationsanweisungen für deinen Browser...</p>';
            installationArea.style.display = 'block';
        }
    }

    // Service Worker Registrierung (Pfad muss korrekt sein, relativ zum Root)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
                window.swRegistration = registration; // Make it available globally for updates etc.
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    }

    // Initiale Anzeige der Installationsstrategie
    displayInstallationStrategy();

    // --- Firefox Desktop Sektion Logik ---
    const firefoxFallbackSection = document.getElementById('firefox-fallback-section');
    if (firefoxFallbackSection) {
        const tabButtons = firefoxFallbackSection.querySelectorAll('.tab-button');
        const tabPanels = firefoxFallbackSection.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Deaktiviere alle Tabs und Panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active')); // CSS steuert display:none

                // Aktiviere den geklickten Tab und das zugehörige Panel
                button.classList.add('active');
                const targetPanelId = button.getAttribute('data-tab');
                const targetPanel = document.getElementById(targetPanelId);
                if (targetPanel) {
                    targetPanel.classList.add('active'); // CSS steuert display:block/flex
                }
            });
        });

        // Extension installieren Button
        const extInstallBtn = document.getElementById('firefox-extension-install-btn');
        if (extInstallBtn) {
            extInstallBtn.addEventListener('click', () => {
                window.open('https://addons.mozilla.org/firefox/addon/pwas-for-firefox/', '_blank');
            });
        }

        // Seite neu laden Button
        const reloadBtn = document.getElementById('firefox-reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }

        // Desktop-Shortcut erstellen Button
        const createShortcutBtn = document.getElementById('firefox-create-shortcut-btn');
        if (createShortcutBtn) {
            createShortcutBtn.addEventListener('click', () => {
                const userAgent = navigator.userAgent.toLowerCase();
                const appName = 'UniversalPWAInstaller'; // Sicherer Dateiname
                const appTitle = 'Universal PWA Installer';
                const appUrl = window.location.href;
                // Versuche, ein Icon zu finden, das im `images` Ordner sein sollte
                const iconUrl = window.location.origin + '/images/icon-512x512.png';

                let content = '';
                let filename = '';
                let contentType = 'text/plain';

                if (userAgent.includes('linux')) {
                    content = `[Desktop Entry]\nVersion=1.0\nType=Application\nName=${appTitle}\nComment=${appTitle}\nExec=firefox --new-window "${appUrl}"\nIcon=${iconUrl}\nCategories=Utility;Network;\nStartupWMClass=Firefox`;
                    filename = `${appName}.desktop`;
                } else if (userAgent.includes('windows nt')) {
                    content = `@echo off\nstart firefox --new-window "${appUrl}"`;
                    filename = `${appName}.bat`;
                } else if (userAgent.includes('mac os x')) {
                    content = `#!/bin/bash\nopen -a Firefox "${appUrl}"`;
                    filename = `${appName}.command`;
                } else {
                    alert('Desktop-Shortcuts werden für Ihr Betriebssystem nicht automatisch unterstützt. Bitte erstellen Sie manuell ein Lesezeichen oder einen Shortcut.');
                    return;
                }

                const blob = new Blob([content], { type: contentType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }
    }
    // --- Ende Firefox Desktop Sektion Logik ---

    // --- iOS Installer Sektion Logik ---
    const iosInstallerSection = document.getElementById('ios-installer-section');
    if (iosInstallerSection && window.detectedBrowserInfo && window.detectedBrowserInfo.isIOS && (window.detectedBrowserInfo.name === 'safari' || (window.detectedBrowserInfo.name === 'firefox' && window.detectedBrowserInfo.isIOS) )) {
        // Nur ausführen, wenn es sich um iOS Safari oder Firefox auf iOS handelt und die Sektion angezeigt wird

        const iosVersionEl = iosInstallerSection.querySelector('#ios-version-info');
        const shortcutsAppEl = iosInstallerSection.querySelector('#shortcuts-app-info');
        const createShortcutBtnIOS = iosInstallerSection.querySelector('#ios-create-shortcut-btn');
        const reloadGuideBtnIOS = iosInstallerSection.querySelector('#ios-reload-guide-btn');
        const advancedHelpToggleBtn = iosInstallerSection.querySelector('#ios-advanced-help-toggle');
        const advancedHelpContent = iosInstallerSection.querySelector('#ios-advanced-help-content');

        function getIOSVersion() {
            // For Firefox on iOS, userAgent might be different
            const ua = navigator.userAgent;
            let match;
            if (window.detectedBrowserInfo.name === 'firefox' && window.detectedBrowserInfo.isIOS) {
                 // Example: Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/103.0 Mobile/15E148 Safari/605.1.15
                match = ua.match(/OS (\d+)_(\d*)/);
            } else { // Safari
                match = ua.match(/OS (\d+)_(\d*)/);
            }

            if (match && match[1]) {
                return parseFloat(match[1] + '.' + (match[2] || 0));
            }
            return 0;
        }

        const iosVersion = getIOSVersion();
        const hasShortcutsApp = iosVersion >= 12; // Shortcuts app was introduced in iOS 12

        if (iosVersionEl) {
            iosVersionEl.textContent = `iOS Version: ${iosVersion > 0 ? iosVersion : 'Unbekannt'}`;
        }
        if (shortcutsAppEl) {
            shortcutsAppEl.textContent = `Shortcuts App: ${hasShortcutsApp ? 'Verfügbar (iOS 12+)' : 'Nicht verfügbar'}`;
            if (createShortcutBtnIOS) {
                createShortcutBtnIOS.style.display = hasShortcutsApp ? 'inline-flex' : 'none';
            }
        }

        // iOS Shortcuts Alternative Button
        if (createShortcutBtnIOS && hasShortcutsApp) {
            createShortcutBtnIOS.addEventListener('click', () => {
                // This is a simplified example. Real .shortcut files are binary plists.
                // A more robust way is to link to a pre-made shortcut if available online.
                // For demonstration, we'll try to mimic a URL scheme if one existed for direct import,
                // but this is highly speculative and likely won't work as simply as this.
                // The provided JSON structure is for the Shortcuts app's internal format,
                // which isn't directly importable via a simple base64 encoded URL in this manner.
                // A common approach is to host the .shortcut file and link to it.
                alert('Die Erstellung von iOS Shortcuts über diesen Weg ist komplex und hier nur simuliert. In einer echten Anwendung würde man auf eine .shortcut Datei verlinken oder eine Anleitung geben.');
                // Example of what one might try if a URL scheme existed (THIS IS SPECULATIVE):
                // const shortcutData = { /* ... complex shortcut structure ... */ };
                // const shortcutURL = `shortcuts://import-workflow/?url=${encodeURIComponent(btoa(JSON.stringify(shortcutData)))}`;
                // window.open(shortcutURL, '_blank');
                // A more realistic approach for a web page:
                // window.open('https://www.icloud.com/shortcuts/yourshortcutid', '_blank'); // If you host it
            });
        }

        if (reloadGuideBtnIOS) {
            reloadGuideBtnIOS.addEventListener('click', () => {
                iosInstallerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        if (advancedHelpToggleBtn && advancedHelpContent) {
            advancedHelpToggleBtn.addEventListener('click', () => {
                const isHidden = advancedHelpContent.style.display === 'none' || advancedHelpContent.style.display === '';
                advancedHelpContent.style.display = isHidden ? 'block' : 'none';
                const toggleIcon = advancedHelpToggleBtn.querySelector('.toggle-icon');
                if (toggleIcon) {
                    toggleIcon.textContent = isHidden ? '▲' : '▼';
                }
            });
        }

        const pushNotificationsFeature = iosInstallerSection.querySelector('#ios-push-feature .limitation-item-content p'); // Target the p tag for text
        const pushNotificationsTitle = iosInstallerSection.querySelector('#ios-push-feature .limitation-item-content strong'); // Target the strong tag

        if (pushNotificationsFeature && pushNotificationsTitle) {
            if (iosVersion >= 16.4) {
                pushNotificationsTitle.textContent = 'Push-Notifications';
                pushNotificationsFeature.textContent = 'Verfügbar für Web-Apps, die dem Home-Bildschirm hinzugefügt wurden (seit iOS 16.4).';
            } else if (iosVersion >= 15.4 && iosVersion < 16) { // Some earlier support might be mentioned but not full
                pushNotificationsTitle.textContent = 'Push-Notifications';
                pushNotificationsFeature.textContent = 'Eingeschränkte Unterstützung. Volle Unterstützung ab iOS 16.4.';
            }
            else {
                pushNotificationsTitle.textContent = 'Push-Notifications';
                pushNotificationsFeature.textContent = 'Nicht oder nur sehr eingeschränkt verfügbar vor iOS 16.4.';
            }
        }
         // Ensure the main section is visible if this logic runs
        if(window.getComputedStyle(iosInstallerSection).display === 'none'){
            iosInstallerSection.style.display = 'block';
        }
    }
    // --- Ende iOS Installer Sektion Logik ---

    // --- Chrome/Edge Installer Sektion Logik ---
    const chromeInstallerSection = document.getElementById('chrome-installer-section'); // Parent section
    const chromeInstallBtn = document.getElementById('chrome-install-btn');
    const chromeInstallInstructions = document.getElementById('chrome-install-instructions');

    if (chromeInstallBtn) {
        chromeInstallBtn.addEventListener('click', async () => {
            if (window.deferredInstallPrompt) {
                // Zeige den Installations-Prompt
                window.deferredInstallPrompt.prompt();

                // Warte auf die Nutzerentscheidung
                const { outcome } = await window.deferredInstallPrompt.userChoice;
                console.log('User choice for A2HS prompt:', outcome);

                if (outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                    // Die 'appinstalled' Event-Listener wird den Rest handhaben (UI-Update zum Erfolgsbildschirm)
                    // Ggf. Button hier schon ausblenden oder Text ändern.
                } else {
                    console.log('User dismissed the A2HS prompt');
                    // Zeige alternative Anweisungen, da der Prompt abgelehnt wurde.
                     if (chromeInstallInstructions) {
                        chromeInstallInstructions.textContent = 'Sie haben die Installation abgelehnt. Sie können die App auch später über das Browser-Menü (oft drei Punkte oder ein Pfeil-Symbol) und dann über "App installieren" oder "Zum Startbildschirm hinzufügen" installieren.';
                        chromeInstallInstructions.style.display = 'block';
                    }
                }
                // Das Prompt kann nur einmal verwendet werden.
                window.deferredInstallPrompt = null;
                // Button wieder verstecken, da der Prompt verbraucht ist
                chromeInstallBtn.style.display = 'none';

            } else {
                // Fallback, falls deferredPrompt aus irgendeinem Grund null ist, obwohl der Button sichtbar war
                // (z.B. wenn der User es schon installiert hat oder der Prompt abgelaufen ist)
                 if (chromeInstallInstructions) {
                    chromeInstallInstructions.textContent = 'Der Installations-Prompt ist derzeit nicht verfügbar. Möglicherweise haben Sie die App bereits installiert oder der Prompt ist abgelaufen. Versuchen Sie es später erneut oder über das Browser-Menü.';
                    chromeInstallInstructions.style.display = 'block';
                }
                if(chromeInstallBtn) chromeInstallBtn.style.display = 'none';
            }
        });
    }
    // Die Logik zur initialen Anzeige des Buttons (wenn 'beforeinstallprompt' feuert)
    // und der Instruktionen (wenn kein Prompt da ist) ist bereits in den 'beforeinstallprompt'
    // Listener und der 'displayInstallationStrategy' Funktion integriert.
    // 'displayInstallationStrategy' wird am Ende von DOMContentLoaded aufgerufen.
});
