document.addEventListener('DOMContentLoaded', () => {
    // Existing browser detection code from the previous step...
    const browserInfoDisplay = document.getElementById('browser-info-display');
    const browserNameEl = document.getElementById('browser-name');
    const browserPlatformEl = document.getElementById('browser-platform');
    const browserLogoEl = document.getElementById('browser-logo');
    const featureChecksEl = document.getElementById('feature-checks');

    // Helper function for bookmark instructions - defined globally within DOMContentLoaded
    function getBookmarkInstructionsGlobal() {
        const platform = navigator.platform.toLowerCase();
        const ua = navigator.userAgent.toLowerCase();
        if (platform.includes('mac')) {
            return 'Drücken Sie Cmd+D oder verwenden Sie Menü → Lesezeichen → Seite zu Lesezeichen hinzufügen.';
        } else if (platform.includes('win') || platform.includes('linux')) {
            return 'Drücken Sie Strg+D oder verwenden Sie Menü → Lesezeichen → Diese Seite zu Lesezeichen hinzufügen.';
        } else if (ua.includes('android')) {
            return 'Tippen Sie auf das Browser-Menü (oft drei Punkte oder Linien) und wählen Sie "Lesezeichen hinzufügen", "Zu Favoriten hinzufügen" oder ein Stern-Symbol.';
        } else if (ua.includes('iphone') || ua.includes('ipad')) {
            // For iOS, the main guide already covers "Add to Home Screen", bookmark is less common for app-like access
            return 'Tippen Sie auf das Teilen-Symbol (<img src="images/ios-share-icon.png" alt="iOS Share Icon" style="height:1em; vertical-align:middle;">) und wählen Sie "Lesezeichen hinzufügen".';
        } else {
            return 'Verwenden Sie die Lesezeichen-Funktion Ihres Browsers, um diese Seite zu speichern.';
        }
    }

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
    // logBrowserInfo(); // Verbose debugging log, can be re-enabled if needed.

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
        let platformText = browser.isMobile ? 'Mobile' : 'Desktop';
        if (browser.isIOS) platformText += ' (iOS)';
        else if (browser.isAndroid) platformText += ' (Android)';
        browserPlatformEl.textContent = platformText;
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
            const chromeInstallInstructions = document.getElementById('chrome-install-instructions');
            if (chromeInstallInstructions) {
                // Instructions might be initially visible, hide them if button appears
                // chromeInstallInstructions.style.display = 'none';
            }
        }
        console.log('beforeinstallprompt event gefangen. App kann installiert werden.');
        displayInstallationStrategy();
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA wurde installiert');
        window.detectedBrowserInfo.isStandalone = true;
        const standaloneFeatureEl = document.querySelector('#feature-checks .feature-check-item:nth-child(3)');
        if(standaloneFeatureEl){
             standaloneFeatureEl.querySelector('.status-icon').textContent = '✅';
             standaloneFeatureEl.classList.remove('not-supported');
             standaloneFeatureEl.classList.add('supported');
        }
        displayInstallationStrategy();
    });

    function displayInstallationStrategy() {
        const browser = window.detectedBrowserInfo;
        let strategy = 'fallback';

        if (browser.isStandalone) {
            strategy = 'already-installed';
        } else if (browser.hasBeforeInstallPrompt && (browser.name === 'chrome' || browser.name === 'edge' || browser.name === 'samsung' || (browser.name === 'opera' && browser.isAndroid) )) {
            strategy = 'automatic';
        } else if (browser.isIOS && browser.name === 'safari') {
            strategy = 'ios-manual';
        } else if (browser.name === 'firefox' && !browser.isMobile) {
            strategy = 'firefox-desktop';
        } else if (browser.name === 'firefox' && browser.isMobile) {
            strategy = browser.isAndroid ? 'firefox-android' : 'ios-manual';
        }

        // console.log('Determined installation strategy:', strategy); // Debugging log
        // console.log('Browser details for strategy:', browser); // Debugging log

        const installerSections = document.querySelectorAll('.installer-section');
        installerSections.forEach(section => section.style.display = 'none');

        const installationArea = document.getElementById('installation-area');
        if (installationArea) {
            installationArea.innerHTML = '';
            installationArea.style.display = 'none';
        }

        let targetSectionId = '';
        switch (strategy) {
            case 'already-installed':
                targetSectionId = 'installation-success-section';
                break;
            case 'automatic':
                targetSectionId = 'chrome-installer-section';
                const chromeInstallBtn = document.getElementById('chrome-install-btn');
                const chromeInstallInstructions = document.getElementById('chrome-install-instructions');
                if(chromeInstallBtn){
                    chromeInstallBtn.style.display = window.deferredInstallPrompt ? 'inline-flex' : 'none';
                }
                if(chromeInstallInstructions){
                    // Show instructions if button is hidden AND prompt is not available (or already used)
                    chromeInstallInstructions.style.display = !window.deferredInstallPrompt ? 'block' : 'none';
                    if (!window.deferredInstallPrompt) {
                         chromeInstallInstructions.textContent = 'Sie können die App auch später über das Browser-Menü (Drei Punkte -> App installieren) installieren.';
                    }
                }
                break;
            case 'ios-manual':
                targetSectionId = 'ios-installer-section';
                if (browser.name === 'firefox' && browser.isIOS) {
                    const iosSectionTitle = document.querySelector('#ios-installer-section h2');
                    if (iosSectionTitle) iosSectionTitle.innerHTML = `<span class="icon">📱</span> Firefox auf iOS - Manuelle Installation`;
                }
                break;
            case 'firefox-desktop':
                targetSectionId = 'firefox-fallback-section';
                break;
            case 'firefox-android':
                targetSectionId = 'fallback-installer-section';
                const fallbackTitle = document.querySelector('#fallback-installer-section h2');
                const fallbackText = document.querySelector('#fallback-installer-section p');
                const fBookmarkBtn = document.getElementById('fallback-bookmark-btn');
                const fHomescreenBtn = document.getElementById('fallback-homescreen-btn');
                const fOfflineFileBtn = document.getElementById('fallback-offline-file-btn');

                if (fallbackTitle) fallbackTitle.innerHTML = `<img src="images/firefox-logo.png" alt="Firefox Logo" class="section-icon"> Firefox Mobile - Installation`;
                if (fallbackText) fallbackText.textContent = 'Du kannst diese App zu deinem Startbildschirm hinzufügen für ein App-ähnliches Erlebnis:';

                if(fHomescreenBtn) {
                    fHomescreenBtn.innerHTML = '<span class="icon">➕</span> Zum Startbildschirm hinzufügen (via Menü)';
                    fHomescreenBtn.style.display = 'inline-flex';
                    let instructionsEl = document.getElementById('firefox-android-instructions');
                    if (!instructionsEl && fallbackText) {
                        instructionsEl = document.createElement('p');
                        instructionsEl.id = 'firefox-android-instructions';
                        instructionsEl.innerHTML = `Öffne das Firefox-Menü (oft drei Punkte <span style="font-weight:bold; font-size:1.2em;">⋮</span>) und wähle <strong style="color: var(--text-accent);">'Zum Startbildschirm hinzufügen'</strong> oder <strong style="color: var(--text-accent);">'Seite installieren'</strong>.`;
                        fallbackText.parentNode.insertBefore(instructionsEl, fallbackText.nextSibling);
                    } else if (instructionsEl) {
                        instructionsEl.style.display = 'block'; // Make sure it's visible
                    }
                }
                if(fBookmarkBtn) fBookmarkBtn.style.display = 'none';
                if(fOfflineFileBtn) fOfflineFileBtn.style.display = 'none';
                break;
            case 'fallback':
            default:
                targetSectionId = 'fallback-installer-section';
                const dFallbackTitle = document.querySelector('#fallback-installer-section h2');
                const dFallbackText = document.querySelector('#fallback-installer-section p');
                const dFallbackBookmarkBtn = document.getElementById('fallback-bookmark-btn');
                const dFallbackHomescreenBtn = document.getElementById('fallback-homescreen-btn');
                const dFallbackOfflineFileBtn = document.getElementById('fallback-offline-file-btn');
                const ffAndroidInstructions = document.getElementById('firefox-android-instructions');

                if (dFallbackTitle) dFallbackTitle.innerHTML = `<span class="icon">❓</span> Andere Browser - Manuelle Optionen`;
                if (dFallbackText) dFallbackText.textContent = 'Ihr Browser unterstützt möglicherweise keine direkte PWA-Installation. Hier sind einige Alternativen:';
                if(dFallbackBookmarkBtn) dFallbackBookmarkBtn.style.display = 'inline-flex';
                if(dFallbackHomescreenBtn) dFallbackHomescreenBtn.style.display = 'inline-flex';
                if(dFallbackOfflineFileBtn) dFallbackOfflineFileBtn.style.display = 'inline-flex';
                if(ffAndroidInstructions) ffAndroidInstructions.style.display = 'none'; // Hide Firefox specific instructions

                break;
        }

        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        } else if (installationArea && strategy !== 'already-installed') {
            installationArea.innerHTML = '<p>Lade Installationsanweisungen für deinen Browser...</p>';
            installationArea.style.display = 'block';
        }
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
                window.swRegistration = registration;
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    }

    displayInstallationStrategy();

    const firefoxFallbackSection = document.getElementById('firefox-fallback-section');
    if (firefoxFallbackSection) {
        const tabButtons = firefoxFallbackSection.querySelectorAll('.tab-button');
        const tabPanels = firefoxFallbackSection.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                button.classList.add('active');
                const targetPanelId = button.getAttribute('data-tab');
                const targetPanel = document.getElementById(targetPanelId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });

        const extInstallBtn = document.getElementById('firefox-extension-install-btn');
        if (extInstallBtn) {
            extInstallBtn.addEventListener('click', () => {
                window.open('https://addons.mozilla.org/firefox/addon/pwas-for-firefox/', '_blank');
            });
        }

        const reloadBtn = document.getElementById('firefox-reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }

        const createShortcutBtn = document.getElementById('firefox-create-shortcut-btn');
        if (createShortcutBtn) {
            createShortcutBtn.addEventListener('click', () => {
                const userAgent = navigator.userAgent.toLowerCase();
                const appName = 'UniversalPWAInstaller';
                const appTitle = document.title || 'Universal PWA Installer';
                const appUrl = window.location.href;
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

    const iosInstallerSection = document.getElementById('ios-installer-section');
    if (iosInstallerSection && window.detectedBrowserInfo && window.detectedBrowserInfo.isIOS && (window.detectedBrowserInfo.name === 'safari' || (window.detectedBrowserInfo.name === 'firefox' && window.detectedBrowserInfo.isIOS) )) {
        const iosVersionEl = iosInstallerSection.querySelector('#ios-version-info');
        const shortcutsAppEl = iosInstallerSection.querySelector('#shortcuts-app-info');
        const createShortcutBtnIOS = iosInstallerSection.querySelector('#ios-create-shortcut-btn');
        const reloadGuideBtnIOS = iosInstallerSection.querySelector('#ios-reload-guide-btn');
        const advancedHelpToggleBtn = iosInstallerSection.querySelector('#ios-advanced-help-toggle');
        const advancedHelpContent = iosInstallerSection.querySelector('#ios-advanced-help-content');

        function getIOSVersion() {
            const ua = navigator.userAgent;
            let match;
            if (window.detectedBrowserInfo.name === 'firefox' && window.detectedBrowserInfo.isIOS) {
                match = ua.match(/OS (\d+)_(\d*)/);
            } else {
                match = ua.match(/OS (\d+)_(\d*)/);
            }

            if (match && match[1]) {
                return parseFloat(match[1] + '.' + (match[2] || 0));
            }
            return 0;
        }

        const iosVersion = getIOSVersion();
        const hasShortcutsApp = iosVersion >= 12;

        if (iosVersionEl) {
            iosVersionEl.textContent = `iOS Version: ${iosVersion > 0 ? iosVersion : 'Unbekannt'}`;
        }
        if (shortcutsAppEl) {
            shortcutsAppEl.textContent = `Shortcuts App: ${hasShortcutsApp ? 'Verfügbar (iOS 12+)' : 'Nicht verfügbar'}`;
            if (createShortcutBtnIOS) {
                createShortcutBtnIOS.style.display = hasShortcutsApp ? 'inline-flex' : 'none';
            }
        }

        if (createShortcutBtnIOS && hasShortcutsApp) {
            createShortcutBtnIOS.addEventListener('click', () => {
                alert('Die Erstellung von iOS Shortcuts über diesen Weg ist komplex und hier nur simuliert. In einer echten Anwendung würde man auf eine .shortcut Datei verlinken oder eine Anleitung geben.');
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

        const pushNotificationsFeature = iosInstallerSection.querySelector('#ios-push-feature .limitation-item-content p');
        const pushNotificationsTitle = iosInstallerSection.querySelector('#ios-push-feature .limitation-item-content strong');

        if (pushNotificationsFeature && pushNotificationsTitle) {
            if (iosVersion >= 16.4) {
                pushNotificationsTitle.textContent = 'Push-Notifications';
                pushNotificationsFeature.textContent = 'Verfügbar für Web-Apps, die dem Home-Bildschirm hinzugefügt wurden (seit iOS 16.4).';
            } else if (iosVersion >= 15.4 && iosVersion < 16) {
                pushNotificationsTitle.textContent = 'Push-Notifications';
                pushNotificationsFeature.textContent = 'Eingeschränkte Unterstützung. Volle Unterstützung ab iOS 16.4.';
            }
            else {
                pushNotificationsTitle.textContent = 'Push-Notifications';
                pushNotificationsFeature.textContent = 'Nicht oder nur sehr eingeschränkt verfügbar vor iOS 16.4.';
            }
        }
        if(window.getComputedStyle(iosInstallerSection).display === 'none'){
            iosInstallerSection.style.display = 'block';
        }
    }

    const chromeInstallerSection = document.getElementById('chrome-installer-section');
    const chromeInstallBtn = document.getElementById('chrome-install-btn');
    const chromeInstallInstructions = document.getElementById('chrome-install-instructions');

    if (chromeInstallBtn) {
        chromeInstallBtn.addEventListener('click', async () => {
            if (window.deferredInstallPrompt) {
                window.deferredInstallPrompt.prompt();
                const { outcome } = await window.deferredInstallPrompt.userChoice;
                console.log('User choice for A2HS prompt:', outcome);
                if (outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                     if (chromeInstallInstructions) {
                        chromeInstallInstructions.textContent = 'Sie haben die Installation abgelehnt. Sie können die App auch später über das Browser-Menü (oft drei Punkte oder ein Pfeil-Symbol) und dann über "App installieren" oder "Zum Startbildschirm hinzufügen" installieren.';
                        chromeInstallInstructions.style.display = 'block';
                    }
                }
                window.deferredInstallPrompt = null;
                chromeInstallBtn.style.display = 'none';

            } else {
                 if (chromeInstallInstructions) {
                    chromeInstallInstructions.textContent = 'Der Installations-Prompt ist derzeit nicht verfügbar. Möglicherweise haben Sie die App bereits installiert oder der Prompt ist abgelaufen. Versuchen Sie es später erneut oder über das Browser-Menü.';
                    chromeInstallInstructions.style.display = 'block';
                }
                if(chromeInstallBtn) chromeInstallBtn.style.display = 'none';
            }
        });
    }

    const fallbackInstallerSection = document.getElementById('fallback-installer-section');
    if (fallbackInstallerSection) {
        const bookmarkBtn = document.getElementById('fallback-bookmark-btn');
        const homescreenBtn = document.getElementById('fallback-homescreen-btn');
        const offlineFileBtn = document.getElementById('fallback-offline-file-btn');

        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => {
                const title = document.title;
                const url = window.location.href;
                try {
                    if (window.sidebar && window.sidebar.addPanel) {
                        window.sidebar.addPanel(title, url, '');
                    } else if (window.external && ('AddFavorite' in window.external)) {
                        window.external.AddFavorite(url, title);
                    } else {
                        const instructionText = 'Um diese Seite als Lesezeichen zu speichern, ' + getBookmarkInstructionsGlobal();
                        const fallbackInstructionsEl = document.getElementById('fallback-instructions-text');
                        if (fallbackInstructionsEl) {
                            fallbackInstructionsEl.innerHTML = instructionText;
                            fallbackInstructionsEl.style.display = 'block';
                        } else {
                            alert(instructionText.replace(/<img[^>]*>/g,""));
                        }
                    }
                } catch (e) {
                     const instructionText = 'Um diese Seite als Lesezeichen zu speichern, ' + getBookmarkInstructionsGlobal();
                     const fallbackInstructionsEl = document.getElementById('fallback-instructions-text');
                    if (fallbackInstructionsEl) {
                        fallbackInstructionsEl.innerHTML = instructionText;
                        fallbackInstructionsEl.style.display = 'block';
                    } else {
                        alert(instructionText.replace(/<img[^>]*>/g,""));
                    }
                }
            });
        }

        if (homescreenBtn) {
            homescreenBtn.addEventListener('click', () => {
                const instructionText = 'So fügen Sie diese Seite zu Ihrem Startbildschirm hinzu (falls von Ihrem Browser unterstützt):\n\n1. Öffnen Sie das Browser-Menü (oft drei Punkte oder Linien).\n2. Suchen Sie nach einer Option wie "Zum Startbildschirm hinzufügen", "App installieren", "Seite anheften" oder einem ähnlichen Wortlaut.\n3. Folgen Sie den Anweisungen Ihres Browsers.';
                const fallbackInstructionsEl = document.getElementById('fallback-instructions-text');
                if (fallbackInstructionsEl) {
                    fallbackInstructionsEl.textContent = instructionText;
                    fallbackInstructionsEl.style.display = 'block';
                } else {
                    alert(instructionText);
                }
            });
        }

        if (offlineFileBtn) {
            offlineFileBtn.addEventListener('click', () => {
                const baseUrl = window.location.origin + (window.location.pathname.startsWith('/') ? window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) : '');
                let iconPath = baseUrl + '/images/icon-192x192.png';

                const appLogoEl = document.getElementById('app-logo');
                if (appLogoEl && appLogoEl.src) {
                    if (appLogoEl.src.startsWith('http')) {
                        iconPath = appLogoEl.src;
                    } else {
                        iconPath = window.location.origin + (appLogoEl.src.startsWith('/') ? '' : '/') + appLogoEl.src;
                    }
                }

                const htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.title || 'PWA Installer'} - Offline Link</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background-color: #0a1a2e; color: #e2e8f0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding:20px; box-sizing: border-box; text-align: center; }
        .container { max-width: 600px; width:100%; padding: 25px; background-color: #16213e; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.5); }
        h1 { color: #63b3ed; font-size: 1.8em; margin-bottom: 0.5em; }
        p { color: #a0aec0; line-height: 1.6; margin-bottom: 1em; font-size: 1em;}
        a.btn { display: inline-block; padding: 12px 25px; background: linear-gradient(135deg, #3182ce, #0bc5ea); color: white; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold; transition: transform 0.2s ease-out, box-shadow 0.2s ease-out; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
        a.btn:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(49,130,206,0.5); }
        img.app-logo { max-width: 80px; margin-bottom: 20px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);}
        small { color: #a0aec0; margin-top: 30px; display: block; font-size: 0.85em;}
    </style>
</head>
<body>
    <div class="container">
        <img src="${iconPath}" alt="App Logo" class="app-logo">
        <h1>${document.title || 'Universal PWA Installer'}</h1>
        <p>Dies ist eine Offline-Verknüpfung zur Web-App.</p>
        <p>Klicken Sie auf den folgenden Link, um die aktuelle Version der App zu öffnen, wenn Sie online sind:</p>
        <a href="${window.location.href}" target="_blank" rel="noopener noreferrer" class="btn">Zur App: ${document.title || 'Universal PWA Installer'}</a>
        <p><small>Sie können diese HTML-Datei lokal speichern (z.B. auf Ihrem Desktop) und öffnen, um schnell zur App zurückzukehren.</small></p>
    </div>
</body>
</html>`;
                const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = (document.title || 'PWA-Installer').replace(/[^a-z0-9]/gi, '_') + '-Link.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }
        if (!document.getElementById('fallback-instructions-text') && fallbackInstallerSection.querySelector('p')) {
            const p = fallbackInstallerSection.querySelector('p');
            const instructionsDiv = document.createElement('div');
            instructionsDiv.id = 'fallback-instructions-text';
            instructionsDiv.style.display = 'none';
            instructionsDiv.style.marginTop = '1rem';
            instructionsDiv.style.padding = '1rem';
            instructionsDiv.style.background = 'var(--bg-tertiary)';
            instructionsDiv.style.borderRadius = 'var(--radius-md)';
            instructionsDiv.style.border = '1px solid var(--border-color)';
            const buttonContainer = fallbackInstallerSection.querySelector('.button-container');
            if (buttonContainer) {
                buttonContainer.parentNode.insertBefore(instructionsDiv, buttonContainer.nextSibling);
            } else if (offlineFileBtn) {
                 offlineFileBtn.parentNode.insertBefore(instructionsDiv, offlineFileBtn.nextSibling);
            } else {
                p.parentNode.insertBefore(instructionsDiv, p.nextSibling);
            }
        }
    }

    const additionalOptionsSection = document.getElementById('additional-options');
    if (additionalOptionsSection) {
        const addBookmarkBtn = document.getElementById('additional-bookmark-btn');
        const setHomepageBtn = document.getElementById('additional-homepage-btn');

        if (addBookmarkBtn) {
            addBookmarkBtn.addEventListener('click', () => {
                const title = document.title;
                const url = window.location.href;
                try {
                    if (window.sidebar && window.sidebar.addPanel) {
                        window.sidebar.addPanel(title, url, '');
                    } else if (window.external && ('AddFavorite' in window.external)) {
                        window.external.AddFavorite(url, title);
                    } else {
                        if (typeof getBookmarkInstructionsGlobal === 'function') {
                            const instructionText = 'Um diese Seite als Lesezeichen zu speichern, ' + getBookmarkInstructionsGlobal().replace(/<img[^>]*>/g,"");
                            alert(instructionText);
                        } else {
                            alert('Um diese Seite als Lesezeichen zu speichern, drücken Sie bitte Strg+D (Windows/Linux) oder Cmd+D (Mac).');
                        }
                    }
                } catch (e) {
                    if (typeof getBookmarkInstructionsGlobal === 'function') {
                        const instructionText = 'Um diese Seite als Lesezeichen zu speichern, ' + getBookmarkInstructionsGlobal().replace(/<img[^>]*>/g,"");
                        alert(instructionText);
                    } else {
                        alert('Um diese Seite als Lesezeichen zu speichern, drücken Sie bitte Strg+D (Windows/Linux) oder Cmd+D (Mac).');
                    }
                }
            });
        }

        if (setHomepageBtn) {
            setHomepageBtn.addEventListener('click', () => {
                alert('Um diese Seite als Ihre Startseite festzulegen, gehen Sie bitte wie folgt vor:\n\n1. Öffnen Sie die Einstellungen Ihres Browsers.\n2. Suchen Sie nach dem Abschnitt "Startseite", "Beim Start" oder "Homepage".\n3. Geben Sie dort die folgende URL ein: ' + window.location.href + '\n4. Speichern Sie die Änderungen.\n\nDie genauen Schritte können je nach Browser leicht variieren.');
            });
        }
    }

    // --- "Problembehebung" Sektion Logik (Akkordeon) ---
    const troubleshootingSection = document.getElementById('troubleshooting');
    if (troubleshootingSection) {
        // It's better to query within the section for its specific collapsibles
        const collapsibleHeaders = troubleshootingSection.querySelectorAll('.collapsible-header');

        collapsibleHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                // Ensure the icon span exists before trying to set its textContent
                const iconSpan = header.querySelector('span:first-child'); // Assuming icon is the first span

                if (content && content.classList.contains('collapsible-content')) {
                    if (content.style.display === 'block') {
                        content.style.display = 'none';
                        if (iconSpan) iconSpan.textContent = '▼';
                        header.classList.remove('active');
                    } else {
                        content.style.display = 'block';
                        if (iconSpan) iconSpan.textContent = '▲';
                        header.classList.add('active');
                    }
                }
            });

            // Initial hide: Only hide if not already styled by CSS to be open (e.g. via an 'open' class)
            // The provided HTML has them without an 'open' class, so they should be hidden.
            const initialContent = header.nextElementSibling;
            if (initialContent && initialContent.classList.contains('collapsible-content')) {
                 // Check if 'open' class is present or if CSS already made it block
                const isInitiallyOpen = initialContent.classList.contains('open') || getComputedStyle(initialContent).display === 'block';
                if (!isInitiallyOpen) {
                    initialContent.style.display = 'none';
                } else {
                     // If it's meant to be open, ensure icon is correct
                    const iconSpan = header.querySelector('span:first-child');
                    if (iconSpan) iconSpan.textContent = '▲';
                    header.classList.add('active');
                }
            }
        });
    }
    // --- Ende "Problembehebung" Sektion Logik ---
});
