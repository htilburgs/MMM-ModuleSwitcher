Module.register("MMM-ModuleSwitcher", {
    defaults: {
        moduleA: "MMM-Kermis",
        moduleB: "MMM-OnSpotify",
        checkInterval: 500,       // Polling interval in ms
        overlayColor: "#000000",  // kleur van de overlay (kan transparant)
        overlayOpacity: 1.0       // 0 = volledig doorzichtig, 1 = volledig bedekt
    },

    start() {
        this.moduleA = null;
        this.moduleB = null;
        this.lastModuleBState = undefined;

        this.overlay = null; // overlay element

        setInterval(() => this.checkModuleBState(), this.config.checkInterval);
    },

    checkModuleBState() {
        const modules = MM.getModules();

        if (!this.moduleA) this.moduleA = modules.find(m => m.name === this.config.moduleA);
        if (!this.moduleB) this.moduleB = modules.find(m => m.name === this.config.moduleB);

        if (!this.moduleA || !this.moduleB || typeof this.moduleB.hidden !== "boolean") return;

        const isActive = this.moduleB.hidden === false;

        // eerste status opslaan
        if (this.lastModuleBState === undefined) {
            this.lastModuleBState = isActive;
            return;
        }

        if (isActive !== this.lastModuleBState) {
            this.lastModuleBState = isActive;

            if (isActive) {
                this.showOverlay();
            } else {
                this.hideOverlay();
            }
        }
    },

    showOverlay() {
        if (!this.moduleA || !this.moduleA.container) return;

        // Maak overlay als die nog niet bestaat
        if (!this.overlay) {
            const rect = this.moduleA.container.getBoundingClientRect();

            const overlay = document.createElement("div");
            overlay.style.position = "absolute";
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = this.config.overlayColor;
            overlay.style.opacity = this.config.overlayOpacity;
            overlay.style.pointerEvents = "auto";
            overlay.style.zIndex = 9999; // boven ModuleA

            // Parent moet position relative zijn
            const parent = this.moduleA.container;
            if (window.getComputedStyle(parent).position === "static") {
                parent.style.position = "relative";
            }

            parent.appendChild(overlay);
            this.overlay = overlay;
        }
    },

    hideOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }
});
