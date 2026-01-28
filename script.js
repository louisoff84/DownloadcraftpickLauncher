const CONFIG = {
    repo: "louisoff84/craftpick-Launcher",
    // ---------------------------------------------------------
    isMaintenance: false, // CHANGE ICI : true = maintenance / false = en ligne
    // ---------------------------------------------------------
    discord: "https://craftpick.fr/discord"
};

async function init() {
    const maintScreen = document.getElementById('maint-screen');
    const siteContent = document.getElementById('site-content');
    const statusLabel = document.getElementById('admin-status');

    // 1. Gestion de la Maintenance
    if (CONFIG.isMaintenance) {
        if (maintScreen) maintScreen.classList.remove('hidden');
        if (siteContent) siteContent.classList.add('hidden');
        if (statusLabel) {
            statusLabel.innerText = "ACTIVÉE";
            statusLabel.className = "text-red-500 font-bold";
        }
    } else {
        if (maintScreen) maintScreen.classList.add('hidden');
        if (siteContent) siteContent.classList.remove('hidden');
        if (statusLabel) {
            statusLabel.innerText = "DÉSACTIVÉE (Site en ligne)";
            statusLabel.className = "text-green-500 font-bold";
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

        const files = {
            win: assets.find(a => a.name.endsWith('.exe')),
            mac: assets.find(a => a.name.endsWith('.dmg')),
            lin: assets.find(a => a.name.endsWith('.AppImage'))
        };

        let os = "win";
        if (navigator.platform.includes('Mac')) os = "mac";
        if (navigator.platform.includes('Linux')) os = "lin";

        const mainFile = files[os] || files['win'];

        document.getElementById('version-label').innerText = `Version ${data.tag_name} (Auto-Update)`;
        document.getElementById('dl-area').innerHTML = `
            <a href="${mainFile.browser_download_url}" class="block bg-green-500 hover:bg-green-400 text-slate-950 font-black py-5 rounded-2xl text-xl transition-all shadow-lg">
                TÉLÉCHARGER
            </a>
            <p class="mt-2 text-[10px] text-slate-500 italic">Fichier détecté : ${mainFile.name}</p>
        `;
    } catch (e) {
        document.getElementById('version-label').innerText = "Erreur de synchro GitHub";
    }
}

init();
