Module.register("MMM-SpotifySwitcher", {
    defaults: {
        moduleA: "MMM-Clock",
        spotifyModule: "MMM-OnSpotify",
        checkInterval: 500,
        animationSpeed: 500
    },

    start() {
        this.moduleA = null;
        this.spotify = null;
        this.spotifyActive = null;

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

        if (!this.moduleA || !this.spotify) return;

        const isActive = this.spotify.hidden === false;

        // Alleen reageren op verandering
        if (isActive !== this.spotifyActive) {
            this.spotifyActive = isActive;

            if (isActive) {
                this.moduleA.hide(this.config.animationSpeed);
            } else {
                this.moduleA.show(this.config.animationSpeed);
            }
        }
    }
});
