/**
 * CONFIGURATION CRAFTPICK
 */
const CONFIG = {
    repo: "louisoff84/craftpick-Launcher",
    isMaintenance: false, // <--- CHANGE ICI : true pour activer la maintenance
    discord: "https://craftpick.fr/discord"
};

// --- LOGIQUE DU SITE ---

function init() {
    const maintScreen = document.getElementById('maint-screen');
    const siteContent = document.getElementById('site-content');
    const statusIndicator = document.getElementById('status-indicator');

    // 1. Gestion de la maintenance
    if (CONFIG.isMaintenance) {
        if (maintScreen) maintScreen.classList.remove('maint-hidden');
        if (siteContent) siteContent.classList.add('maint-hidden');
        if (statusIndicator) {
            statusIndicator.innerText = "Maintenance ACTIVÉE";
            statusIndicator.className = "text-red-500";
        }
    } else {
        if (maintScreen) maintScreen.classList.add('maint-hidden');
        if (siteContent) siteContent.classList.remove('maint-hidden');
        if (statusIndicator) {
            statusIndicator.innerText = "Site EN LIGNE";
            statusIndicator.className = "text-green-500";
        }
        // Charger GitHub seulement si pas de maintenance
        if (document.getElementById('dl-area')) fetchGitHub();
    }
}

async function fetchGitHub() {
    try {
        const res = await fetch(`https://api.github.com/repos/${CONFIG.repo}/releases/latest`);
        const data = await res.json();
        const assets = data.assets;

        // Détection auto du fichier selon l'OS
        let osName = "Windows";
        let targetFile = assets.find(a => a.name.endsWith('.exe'));

        if (navigator.platform.includes('Mac')) {
            osName = "macOS";
            targetFile = assets.find(a => a.name.endsWith('.dmg')) || targetFile;
        } else if (navigator.platform.includes('Linux')) {
            osName = "Linux";
            targetFile = assets.find(a => a.name.endsWith('.AppImage')) || targetFile;
        }

        document.getElementById('version-label').innerText = `Version ${data.tag_name}`;
        document.getElementById('dl-area').innerHTML = `
            <a href="${targetFile.browser_download_url}" class="block bg-green-500 hover:bg-green-400 text-slate-950 font-black py-5 rounded-2xl text-xl transition-all hover:scale-105">
                TÉLÉCHARGER (${osName})
            </a>
        `;
    } catch (e) {
        document.getElementById('version-label').innerText = "Erreur GitHub API";
    }
}

// Lancement
init();
