const CONFIG = {
    repo: "louisoff84/craftpick-Launcher",
    isMaintenance: false // Change juste ici pour couper le site
};

async function checkLauncher() {
    const dlArea = document.getElementById('dl-area');
    const vLabel = document.getElementById('version-label');

    try {
        // Le script demande à GitHub : "Quelle est la version la plus récente ?"
        const response = await fetch(`https://api.github.com/repos/${CONFIG.repo}/releases/latest`);
        const data = await response.json();
        const assets = data.assets;

        // Il trie les fichiers automatiquement par extension
        const files = {
            win: assets.find(a => a.name.endsWith('.exe')),
            mac: assets.find(a => a.name.endsWith('.dmg')),
            lin: assets.find(a => a.name.endsWith('.AppImage'))
        };

        // Détection de l'ordinateur du joueur
        let os = "win";
        if (navigator.platform.includes('Mac')) os = "mac";
        if (navigator.platform.includes('Linux')) os = "lin";

        const mainFile = files[os] || files['win']; // Windows par défaut si OS non reconnu

        // Mise à jour du texte de version (ex: v1.1.2)
        vLabel.innerText = `VERSION ${data.tag_name} - MISE À JOUR AUTO`;

        // Affichage du bouton de téléchargement dynamique
        dlArea.innerHTML = `
            <a href="${mainFile.browser_download_url}" class="block bg-green-500 hover:bg-green-400 text-slate-950 font-black py-5 rounded-2xl text-xl transition-all shadow-lg">
                TÉLÉCHARGER (${os.toUpperCase()})
            </a>
            <div class="flex justify-center gap-4 mt-6 opacity-40 text-[10px] font-bold">
                ${files.win ? `<a href="${files.win.browser_download_url}">WINDOWS</a>` : ''}
                ${files.mac ? `<a href="${files.mac.browser_download_url}">MAC</a>` : ''}
                ${files.lin ? `<a href="${files.lin.browser_download_url}">LINUX</a>` : ''}
            </div>
        `;

    } catch (error) {
        vLabel.innerText = "ERREUR DE CONNEXION GITHUB";
    }
}

// Lancement automatique
if (document.getElementById('dl-area')) checkLauncher();
