document.addEventListener('DOMContentLoaded', () => {
    // --- Browser-Erkennungslogik ---
    const browserNameDisplayEl = document.getElementById('browser-name-display');
    const browserPlatformDisplayEl = document.getElementById('browser-platform-display');
    const browserLogoImgEl = document.getElementById('browser-logo-img');

    const checkServiceWorkerEl = document.getElementById('check-service-worker');
    const checkInstallPromptEl = document.getElementById('check-install-prompt');
    const checkStandaloneModeEl = document.getElementById('check-standalone-mode');
    const checkMobilePlatformEl = document.getElementById('check-mobile-platform');

    function detectBrowserAndFeatures() {
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        const info = {
            name: 'Unbekannt',
            version: '',
            os: 'Unbekannt',
            isChrome: /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua),
            isEdge: /Edg\//.test(ua),
            isSafari: /^((?!chrome|android).)*safari/i.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua),
            isFirefox: /Firefox\//.test(ua) || /FxiOS\//.test(ua),
            isOpera: /OPR\//.test(ua),
            isSamsung: /SamsungBrowser/.test(ua),
            isIOS: /iPad|iPhone|iPod/.test(ua) && !window.MSStream,
            isAndroid: /Android/.test(ua),
            isMobile: /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            supportsServiceWorker: 'serviceWorker' in navigator,
            isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://'),
            hasBeforeInstallPrompt: false // Wird durch Event aktualisiert
        };

        // OS-Erkennung
        if (info.isAndroid) info.os = 'Android';
        else if (info.isIOS) info.os = 'iOS';
        else if (platform.indexOf('Win') !== -1) info.os = 'Windows';
        else if (platform.indexOf('Mac') !== -1) info.os = 'macOS';
        else if (platform.indexOf('Linux') !== -1) info.os = 'Linux';

        // Browsername & Version genauer bestimmen
        let temp;
        let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+([._\d]*))/i) || [];
        if (/trident/i.test(M[1])) {
            temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
            info.name = 'IE';
            info.version = temp[1] || '';
        }
        if (M[1] === 'Chrome') {
            temp = ua.match(/\b(OPR|Edge|Edg)\/(\d+([._\d]*))/);
            if (temp != null) {
                const browserFullName = temp.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg', 'Edge');
                const parts = browserFullName.split(' ');
                info.name = parts[0];
                info.version = parts[1];
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((temp = ua.match(/version\/(\d+([._\d]*))/i)) != null) M.splice(1, 1, temp[1]);

        if (info.name === 'Unbekannt' || info.name === 'Chrome') { // Verfeinerung, falls noch 'Chrome' oder 'Unbekannt'
            if (info.isEdge) info.name = 'Edge';
            else if (info.isOpera) info.name = 'Opera';
            else if (info.isSamsung) info.name = 'Samsung Internet';
            else if (info.isFirefox && !/FxiOS/.test(ua)) info.name = 'Firefox'; // Firefox Desktop/Android
            else if (info.isSafari && !/CriOS/.test(ua) && !/FxiOS/.test(ua)) info.name = 'Safari';
            else if (info.isChrome && !/CriOS/.test(ua)) info.name = 'Chrome';
        }

        // Spezifische iOS Browsererkennung
        if (info.isIOS) {
            if (/CriOS/.test(ua)) info.name = 'Chrome'; // Chrome auf iOS
            else if (/FxiOS/.test(ua)) info.name = 'Firefox'; // Firefox auf iOS
            else if (info.isSafari) info.name = 'Safari'; // Safari auf iOS (Standard)
        }

        if (info.name !== 'IE' && M[0] && M[1] && !info.version) {
            info.version = M[1];
        }

        // Name formatieren
        info.name = info.name.charAt(0).toUpperCase() + info.name.slice(1);

        return info;
    }

    window.detectedBrowserInfo = detectBrowserAndFeatures();
    const browser = window.detectedBrowserInfo;

    // UI Aktualisieren
    if (browserNameDisplayEl) browserNameDisplayEl.textContent = browser.name + (browser.version ? ` ${browser.version}` : '');
    if (browserPlatformDisplayEl) browserPlatformDisplayEl.textContent = `${browser.os}${browser.isMobile ? ' (Mobile)' : ' (Desktop)'}`;

    if (browserLogoImgEl) {
        let logo = 'images/browser-placeholder.png';
        if (browser.name.toLowerCase().includes('chrome')) logo = 'images/chrome-logo.png';
        else if (browser.name.toLowerCase().includes('firefox')) logo = 'images/firefox-logo.png';
        else if (browser.name.toLowerCase().includes('edge')) logo = 'images/edge-logo.png';
        else if (browser.name.toLowerCase().includes('safari')) logo = 'images/safari-logo.png';
        else if (browser.name.toLowerCase().includes('opera')) logo = 'images/opera-logo.png';
        else if (browser.name.toLowerCase().includes('samsung')) logo = 'images/samsung-internet-logo.png';
        browserLogoImgEl.src = logo;
        browserLogoImgEl.alt = browser.name + ' Logo';
    }

    function updateFeatureCheck(element, supported) {
        if (element) {
            const iconEl = element.querySelector('.status-icon');
            if (supported) {
                element.classList.add('supported');
                element.classList.remove('not-supported');
                iconEl.textContent = '✅';
                iconEl.classList.add('supported');
                iconEl.classList.remove('not-supported');
            } else {
                element.classList.add('not-supported');
                element.classList.remove('supported');
                iconEl.textContent = '❌';
                iconEl.classList.add('not-supported');
                iconEl.classList.remove('supported');
            }
        }
    }

    // Initialer Check für Install Prompt (kann sich durch Event ändern)
    const installPromptFeatureItem = document.getElementById('check-install-prompt');
    if (installPromptFeatureItem) {
        const iconEl = installPromptFeatureItem.querySelector('.status-icon');
        iconEl.textContent = '❓'; // Initial auf '?' setzen, da wir auf das Event warten
        // Klasse wird durch Event-Listener gesetzt
    }

    updateFeatureCheck(checkServiceWorkerEl, browser.supportsServiceWorker);
    updateFeatureCheck(checkStandaloneModeEl, browser.isStandalone);
    updateFeatureCheck(checkMobilePlatformEl, browser.isMobile);

    // Event Listener für beforeinstallprompt (leicht angepasst)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredInstallPrompt = e;
        window.detectedBrowserInfo.hasBeforeInstallPrompt = true; // Update global state
        if (installPromptFeatureItem) { // Ensure element exists
             updateFeatureCheck(installPromptFeatureItem, true);
        }
        console.log('PWA Install Prompt verfügbar.');
        // Hier wird displayInstallationStrategy() aufgerufen, um die UI basierend auf neuen Infos zu aktualisieren
        if (typeof displayInstallationStrategy === 'function') displayInstallationStrategy();
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA wurde installiert.');
        window.detectedBrowserInfo.isStandalone = true; // Update global state
        updateFeatureCheck(checkStandaloneModeEl, true);
        if (typeof displayInstallationStrategy === 'function') displayInstallationStrategy();
    });

    // Service Worker Registrierung
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker erfolgreich registriert, Scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker Registrierung fehlgeschlagen:', error);
            });
    } else {
        console.log('Service Worker wird von diesem Browser nicht unterstützt.');
    }
    // --- Ende Browser-Erkennungslogik ---

    // --- Logik für Installationsstrategien und dynamische Komponenten ---
    function displayInstallationStrategy() {
        const browserInfo = window.detectedBrowserInfo; // Verwende die global gespeicherten Infos
        if (!browserInfo) {
            console.error('Browser Info nicht verfügbar für Installationsstrategie.');
            return;
        }

        let strategy = 'fallback'; // Default Strategie

        if (browserInfo.isStandalone) {
            strategy = 'already-installed';
        } else if (window.deferredInstallPrompt && (browserInfo.name === 'Chrome' || browserInfo.name === 'Edge' || browserInfo.name === 'Samsung Internet' || browserInfo.name === 'Opera')) {
            strategy = 'automatic';
        } else if (browserInfo.isIOS && browserInfo.name === 'Safari') {
            strategy = 'ios-manual';
        } else if (browserInfo.name === 'Firefox' && !browserInfo.isMobile) { // Unterscheide Desktop und Mobile für Firefox
            strategy = 'firefox-desktop';
        } else if (browserInfo.name === 'Firefox' && browserInfo.isMobile) { // Firefox Mobile (Android)
            strategy = 'firefox-android';
        }

        console.log('Gewählte Installationsstrategie:', strategy);

        // Alle Installer-Sektionen ausblenden (angenommen, sie haben eine gemeinsame Klasse .installer-section)
        const installerSections = document.querySelectorAll('.installer-section'); // Diese Klasse muss im HTML verwendet werden!
        installerSections.forEach(section => section.style.display = 'none');

        // Haupt-Platzhalter für Installationsanweisungen ebenfalls ausblenden, falls vorhanden
        const installationArea = document.getElementById('installation-area'); // Diese ID muss im HTML sein!
        if (installationArea) {
            installationArea.style.display = 'none';
            installationArea.innerHTML = ''; // Inhalt leeren
        }

        let targetSectionId = '';
        switch (strategy) {
            case 'already-installed':
                targetSectionId = 'installation-success-section'; // ID muss im HTML existieren
                break;
            case 'automatic':
                targetSectionId = 'chrome-installer-section'; // ID muss im HTML existieren
                break;
            case 'ios-manual':
                targetSectionId = 'ios-installer-section'; // ID muss im HTML existieren
                break;
            case 'firefox-desktop':
                targetSectionId = 'firefox-fallback-section'; // ID muss im HTML existieren
                break;
            case 'firefox-android':
                targetSectionId = 'fallback-installer-section'; // Beispiel: Nutzen der Fallback Sektion für Firefox Mobile
                                                              // Ideal: Eigene Sektion 'firefox-mobile-section'
                // Hier könnte man den Inhalt von #fallback-installer-section dynamisch anpassen für Firefox Mobile
                // z.B. document.querySelector('#fallback-installer-section h2').textContent = 'Firefox Mobile Installation';
                break;
            case 'fallback':
            default:
                targetSectionId = 'fallback-installer-section'; // ID muss im HTML existieren
                break;
        }

        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.style.display = 'block'; // Oder 'flex', je nach CSS-Design der Sektion
        } else {
            if (installationArea) { // Fallback, falls die Ziel-Sektion nicht existiert
                installationArea.innerHTML = '<p>Spezifische Installationsanweisungen für Ihren Browser werden vorbereitet. Bitte warten Sie einen Moment.</p>';
                installationArea.style.display = 'block';
            }
            console.warn(`Keine spezifische Installer-Sektion mit ID '${targetSectionId}' für Strategie '${strategy}' gefunden.`);
        }

        // Zusätzliche UI-Anpassungen nach dem Anzeigen der Sektion (z.B. Install-Button in Chrome-Sektion)
        if (strategy === 'automatic') {
            const chromeInstallBtn = document.getElementById('chrome-install-btn'); // ID muss im HTML existieren
            const chromeInstallInstructions = document.getElementById('chrome-install-instructions'); // ID muss im HTML existieren
            if (window.deferredInstallPrompt) {
                if (chromeInstallBtn) chromeInstallBtn.style.display = 'inline-flex';
                if (chromeInstallInstructions) chromeInstallInstructions.style.display = 'none';
            } else {
                if (chromeInstallBtn) chromeInstallBtn.style.display = 'none';
                if (chromeInstallInstructions) {
                    chromeInstallInstructions.textContent = 'Sie können die App auch später über das Browser-Menü (Drei Punkte -> App installieren) installieren.';
                    chromeInstallInstructions.style.display = 'block';
                }
            }
        }
    }
    // Initialer Aufruf, um die korrekte Sektion anzuzeigen
    displayInstallationStrategy();

    // --- Firefox Desktop Sektion Logik ---
    const firefoxFallbackSection = document.getElementById('firefox-fallback-section');

    if (firefoxFallbackSection) {
        const tabButtons = firefoxFallbackSection.querySelectorAll('.tab-button');
        const tabPanels = firefoxFallbackSection.querySelectorAll('.tab-panel');
        const extInstallBtn = document.getElementById('firefox-extension-install-btn');
        const reloadBtn = document.getElementById('firefox-reload-btn');
        const createShortcutBtn = document.getElementById('firefox-create-shortcut-btn');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active')); // CSS steuert display via .active

                button.classList.add('active');
                const targetPanelId = button.getAttribute('data-tab');
                const targetPanel = document.getElementById(targetPanelId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });

        if (extInstallBtn) {
            extInstallBtn.addEventListener('click', () => {
                window.open('https://addons.mozilla.org/firefox/addon/pwas-for-firefox/', '_blank');
            });
        }

        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }

        if (createShortcutBtn) {
            createShortcutBtn.addEventListener('click', () => {
                const userAgent = navigator.userAgent.toLowerCase();
                const appName = 'UniversalPWAInstaller';
                const appTitle = document.title || 'Universal PWA Installer';
                const appUrl = window.location.href;
                // Sicherstellen, dass der Icon-Pfad absolut ist oder korrekt relativ zum Ursprung
                const iconPath = new URL('images/icon-512x512.png', window.location.origin).href;

                let content = '';
                let filename = '';
                let contentType = 'text/plain';

                if (userAgent.includes('linux')) {
                    content = `[Desktop Entry]\nVersion=1.0\nType=Application\nName=${appTitle}\nComment=${appTitle}\nExec=firefox --new-window "${appUrl}"\nIcon=${iconPath}\nTerminal=false\nCategories=Utility;WebBrowser;\nStartupWMClass=firefox`; // StartupWMClass kann variieren
                    filename = `${appName}.desktop`;
                } else if (userAgent.includes('windows nt')) {
                    content = `@echo off\nstart firefox --new-window "${appUrl}"\ntitle ${appTitle}`; // Titel für das Konsolenfenster hinzugefügt
                    filename = `${appName}.bat`;
                } else if (userAgent.includes('mac os x')) {
                    // Für macOS wäre eine .webloc-Datei oder ein AppleScript-basierter .app-Wrapper besser,
                    // aber eine .command-Datei ist eine einfache ausführbare Alternative.
                    content = `#!/bin/bash\nopen -a "Firefox" "${appUrl}"`;
                    filename = `${appName}.command`;
                } else {
                    alert('Desktop-Shortcuts werden für Ihr Betriebssystem nicht direkt unterstützt. Bitte erstellen Sie manuell ein Lesezeichen oder einen Shortcut.');
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

    // --- "Weitere Optionen" Sektion Logik ---
    const additionalOptionsSection = document.getElementById('additional-options');
    if (additionalOptionsSection) {
        const addBookmarkBtn = document.getElementById('additional-bookmark-btn');
        const setHomepageBtn = document.getElementById('additional-homepage-btn');

        // Globale Hilfsfunktion für Lesezeichen-Anweisungen (angenommen, sie existiert bereits)
        // function getBookmarkInstructionsGlobal() { ... }
        // Falls nicht, hier eine Basisimplementierung:
        if (typeof getBookmarkInstructionsGlobal === 'undefined') {
            window.getBookmarkInstructionsGlobal = function() {
                const platform = navigator.platform.toLowerCase();
                const ua = navigator.userAgent.toLowerCase();
                if (platform.includes('mac')) {
                    return 'Drücken Sie Cmd+D oder verwenden Sie Menü → Lesezeichen → Seite zu Lesezeichen hinzufügen.';
                } else if (platform.includes('win') || platform.includes('linux')) {
                    return 'Drücken Sie Strg+D oder verwenden Sie Menü → Lesezeichen → Diese Seite zu Lesezeichen hinzufügen.';
                } else if (ua.includes('android')) {
                    return 'Tippen Sie auf das Browser-Menü (oft drei Punkte oder Linien) und wählen Sie "Lesezeichen hinzufügen", "Zu Favoriten hinzufügen" oder ein Stern-Symbol.';
                } else if (ua.includes('iphone') || ua.includes('ipad')) {
                    return 'Tippen Sie auf das Teilen-Symbol und wählen Sie "Lesezeichen hinzufügen".';
                } else {
                    return 'Verwenden Sie die Lesezeichen-Funktion Ihres Browsers, um diese Seite zu speichern.';
                }
            }
        }

        if (addBookmarkBtn) {
            addBookmarkBtn.addEventListener('click', () => {
                const title = document.title;
                const url = window.location.href;
                try {
                    if (window.sidebar && window.sidebar.addPanel) { // Firefox < 23
                        window.sidebar.addPanel(title, url, '');
                    } else if (window.external && ('AddFavorite' in window.external)) { // IE
                        window.external.AddFavorite(url, title);
                    } else { // Andere Browser
                        alert('Um diese Seite als Lesezeichen zu speichern, ' + getBookmarkInstructionsGlobal());
                    }
                } catch (e) {
                    alert('Um diese Seite als Lesezeichen zu speichern, ' + getBookmarkInstructionsGlobal());
                }
            });
        }

        if (setHomepageBtn) {
            setHomepageBtn.addEventListener('click', () => {
                alert('Um diese Seite als Ihre Startseite festzulegen, gehen Sie bitte wie folgt vor:\n\n1. Öffnen Sie die Einstellungen Ihres Browsers.\n2. Suchen Sie nach dem Abschnitt "Startseite", "Beim Start" oder "Homepage".\n3. Geben Sie dort die folgende URL ein: ' + window.location.href + '\n4. Speichern Sie die Änderungen.\n\nDie genauen Schritte können je nach Browser leicht variieren.');
            });
        }
    }
    // --- Ende "Weitere Optionen" Sektion Logik ---

    // --- "Problembehebung" Sektion Logik (Akkordeon) ---
    const troubleshootingSection = document.getElementById('troubleshooting');
    if (troubleshootingSection) {
        const collapsibleHeaders = troubleshootingSection.querySelectorAll('.collapsible-header');

        collapsibleHeaders.forEach(header => {
            // Initialen Zustand des Icons setzen, falls der Inhalt bereits sichtbar ist (durch CSS oder vorheriges JS)
            const initialContent = header.nextElementSibling;
            const initialIcon = header.querySelector('span'); // Annahme: Pfeil-Icon ist das erste Span im Header

            if (initialContent && initialContent.classList.contains('collapsible-content')) {
                if (initialContent.style.display === 'block' || getComputedStyle(initialContent).display === 'block') {
                    if (initialIcon) initialIcon.textContent = '▲';
                    header.classList.add('active');
                } else {
                    if (initialIcon) initialIcon.textContent = '▼';
                    initialContent.style.display = 'none'; // Explizit verstecken, falls nicht durch CSS
                }
            }

            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('span'); // Annahme: Pfeil-Icon ist das erste Span im Header

                if (content && content.classList.contains('collapsible-content')) {
                    const isOpen = content.style.display === 'block';
                    content.style.display = isOpen ? 'none' : 'block';
                    if (icon) {
                        icon.textContent = isOpen ? '▼' : '▲';
                    }
                    if (isOpen) {
                        header.classList.remove('active');
                    } else {
                        header.classList.add('active');
                    }
                }
            });
        });
    }
    // --- Ende "Problembehebung" Sektion Logik ---
}); // Ende DOMContentLoaded
