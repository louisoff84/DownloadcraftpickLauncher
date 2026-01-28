const CONFIG = {
    repo: "louisoff84/craftpick-Launcher",
    isMaintenance: true, 
    discord: "https://craftpick.fr/discord"
};

function init() {
    const maintScreen = document.getElementById('maint-screen');
    const siteContent = document.getElementById('site-content');

    if (CONFIG.isMaintenance) {
        if (maintScreen) maintScreen.classList.remove('maint-hidden');
        if (siteContent) siteContent.classList.add('maint-hidden');
    } else {
        if (maintScreen) maintScreen.classList.add('maint-hidden');
        if (siteContent) siteContent.classList.remove('maint-hidden');
        if (document.getElementById('dl-area')) fetchGitHub();
    }
}

async function fetchGitHub() {
    try {
        const res = await fetch(`https://api.github.com/repos/${CONFIG.repo}/releases/latest`);
        const data = await res.json();
        const assets = data.assets;

        // Détection de l'OS du visiteur
        let userOS = "win"; 
        if (navigator.platform.toUpperCase().indexOf('MAC') !== -1) userOS = "mac";
        if (navigator.platform.toUpperCase().indexOf('LINUX') !== -1) userOS = "linux";

        // Recherche des fichiers dans ta release GitHub
        const winFile = assets.find(a => a.name.toLowerCase().includes('.exe'));
        const macFile = assets.find(a => a.name.toLowerCase().includes('.dmg') || a.name.toLowerCase().includes('mac'));
        const linFile = assets.find(a => a.name.toLowerCase().includes('.appimage') || a.name.toLowerCase().includes('linux'));

        const links = { win: winFile, mac: macFile, linux: linFile };
        
        // On choisit le fichier à mettre en avant
        const currentDownload = links[userOS] || winFile; 

        document.getElementById('version-label').innerText = `Version ${data.tag_name} disponible`;
        
        let htmlBtn = "";
        if (currentDownload) {
            htmlBtn = `
                <a href="${currentDownload.browser_download_url}" class="block bg-green-500 hover:bg-green-400 text-slate-950 font-black py-5 rounded-2xl text-xl transition-all hover:scale-105 shadow-lg shadow-green-500/20">
                    TÉLÉCHARGER (${userOS.toUpperCase()})
                </a>`;
        } else {
            htmlBtn = `<p class="text-orange-400 text-sm">Fichier non trouvé pour votre OS. <br> <a class="underline" href="https://github.com/${CONFIG.repo}/releases">Voir sur GitHub</a></p>`;
        }

        // Ajout des petits liens en dessous pour les autres OS
        let others = `<div class="flex justify-center gap-4 mt-6 opacity-60 text-xs font-bold">`;
        if (winFile && userOS !== 'win') others += `<a href="${winFile.browser_download_url}" class="hover:text-white">WINDOWS (.EXE)</a>`;
        if (macFile && userOS !== 'mac') others += `<a href="${macFile.browser_download_url}" class="hover:text-white">MAC (.DMG)</a>`;
        if (linFile && userOS !== 'linux') others += `<a href="${linFile.browser_download_url}" class="hover:text-white">LINUX (.APPIMAGE)</a>`;
        others += `</div>`;

        document.getElementById('dl-area').innerHTML = htmlBtn + others;

    } catch (e) {
        document.getElementById('version-label').innerText = "Erreur de chargement GitHub";
    }
}

init();
