Module.register("MMM-ModuleSwitcher", {
    defaults: {
        moduleA: "MMM-Kermis",       // Module die je wilt verbergen
        spotifyModule: "MMM-OnSpotify",
        checkInterval: 500,          // Polling interval in ms
        animationSpeed: 500          // Fade snelheid
    },

    start() {
        this.moduleA = null;
        this.spotify = null;
        this.lastSpotifyState = undefined;

        // Polling interval voor Spotify status
        setInterval(() => this.checkSpotifyState(), this.config.checkInterval);
    },

    checkSpotifyState() {
        const modules = MM.getModules();

        if (!this.moduleA) {
            this.moduleA = modules.find(m => m.name === this.config.moduleA);
        }

        if (!this.spotify) {
            this.spotify = modules.find(m => m.name === this.config.spotifyModule);
        }

        if (!this.moduleA || !this.spotify || typeof this.spotify.hidden !== "boolean") return;

        const currentState = this.spotify.hidden === false;

        // Eerste geldige state opslaan zonder actie
        if (this.lastSpotifyState === undefined) {
            this.lastSpotifyState = currentState;
            return;
        }

        // Alleen reageren op echte verandering
        if (currentState !== this.lastSpotifyState) {
            this.lastSpotifyState = currentState;

            if (currentState) {
                // Spotify actief → moduleA visueel verbergen
                this.fadeOutModule(this.moduleA, this.config.animationSpeed);
            } else {
                // Spotify stopt → moduleA weer tonen
                this.fadeInModule(this.moduleA, this.config.animationSpeed);
            }
        }
    },

    fadeOutModule(module, speed) {
        if (!module || !module.container) return;
        module.container.style.transition = `opacity ${speed}ms`;
        module.container.style.opacity = 0;
        module.container.style.pointerEvents = "none";
    },

    fadeInModule(module, speed) {
        if (!module || !module.container) return;
        module.container.style.transition = `opacity ${speed}ms`;
        module.container.style.opacity = 1;
        module.container.style.pointerEvents = "auto";
    }
});
