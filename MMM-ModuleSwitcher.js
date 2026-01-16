Module.register("MMM-SpotifySwitcher", {
    defaults: {
        moduleA: "MMM-Clock",
        spotifyModule: "MMM-OnSpotify",
        checkInterval: 500,
        animationSpeed: 500,
        lockString: "SPOTIFY_ACTIVE"
    },

    start() {
        this.moduleA = null;
        this.spotify = null;
        this.lastSpotifyState = undefined;

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

        // Wacht tot beide modules echt bestaan én Spotify een status heeft
        if (!this.moduleA || !this.spotify || typeof this.spotify.hidden !== "boolean") {
            return;
        }

        const currentState = this.spotify.hidden === false;

        // 🚨 BELANGRIJK: eerste geldige state alleen opslaan
        if (this.lastSpotifyState === undefined) {
            this.lastSpotifyState = currentState;
            return;
        }

        // Alleen reageren op echte statusverandering
        if (currentState !== this.lastSpotifyState) {
            this.lastSpotifyState = currentState;

            if (currentState) {
                // Spotify wordt actief
                this.moduleA.hide(this.config.animationSpeed, {
                    lockString: this.config.lockString
                });
            } else {
                // Spotify stopt
                this.moduleA.show(this.config.animationSpeed, {
                    lockString: this.config.lockString
                });
            }
        }
    }
});
