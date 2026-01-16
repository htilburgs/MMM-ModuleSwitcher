Module.register("MMM-ModuleSwitcher", {
    defaults: {
        moduleA: "MMM-Kermis",      // Module die tijdelijk verborgen moet worden
        moduleB: "MMM-OnSpotify",   // Trigger module
        checkInterval: 500,         // Polling interval in ms
        animationSpeed: 500         // Fade snelheid
    },

    start() {
        this.moduleA = null;
        this.moduleB = null;
        this.lastModuleBState = undefined;

        setInterval(() => this.checkModuleBState(), this.config.checkInterval);
    },

    checkModuleBState() {
        const modules = MM.getModules();

        if (!this.moduleA) this.moduleA = modules.find(m => m.name === this.config.moduleA);
        if (!this.moduleB) this.moduleB = modules.find(m => m.name === this.config.moduleB);

        if (!this.moduleA || !this.moduleB || typeof this.moduleB.hidden !== "boolean") return;

        const isActive = this.moduleB.hidden === false;

        if (this.lastModuleBState === undefined) {
            this.lastModuleBState = isActive;
            return;
        }

        if (isActive !== this.lastModuleBState) {
            this.lastModuleBState = isActive;

            if (isActive) {
                this.fadeOutModule(this.moduleA);
            } else {
                this.fadeInModule(this.moduleA);
            }
        }
    },

    fadeOutModule(module) {
        if (!module || !module.container) return;
        module.container.style.transition = `opacity ${this.config.animationSpeed}ms`;
        module.container.style.opacity = 0;
        module.container.style.pointerEvents = "none";
    },

    fadeInModule(module) {
        if (!module || !module.container) return;
        module.container.style.transition = `opacity ${this.config.animationSpeed}ms`;
        module.container.style.opacity = 1;
        module.container.style.pointerEvents = "auto";
    }
});
