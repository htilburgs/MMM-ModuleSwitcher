Module.register("MMM-ModuleSwitcher", {
    defaults: {
        moduleA: "MMM-Kermis",    // Module die je wilt verbergen
        moduleB: "MMM-OnSpotify", // Module die de trigger is
        checkInterval: 500,       // Polling interval in ms
        animationSpeed: 500       // Fade snelheid
    },

    start() {
        this.moduleA = null;
        this.moduleB = null;
        this.lastModuleBState = undefined;

        setInterval(() => this.checkModuleBState(), this.config.checkInterval);
    },

    checkModuleBState() {
        const modules = MM.getModules();

        if (!this.moduleA) {
            this.moduleA = modules.find(m => m.name === this.config.moduleA);
        }
        if (!this.moduleB) {
            this.moduleB = modules.find(m => m.name === this.config.moduleB);
        }
        if (!this.moduleA || !this.moduleB || typeof this.moduleB.hidden !== "boolean") return;

        const currentState = this.moduleB.hidden === false;

        // Eerste geldige state opslaan zonder actie
        if (this.lastModuleBState === undefined) {
            this.lastModuleBState = currentState;
            return;
        }

        // Alleen reageren op status verandering
        if (currentState !== this.lastModuleBState) {
            this.lastModuleBState = currentState;

            if (currentState) {
                this.hideModuleAbsolute(this.moduleA);
            } else {
                this.showModuleAbsolute(this.moduleA);
            }
        }
    },

    hideModuleAbsolute(module) {
        if (!module || !module.container) return;

        // Zorg dat module absoluut gepositioneerd wordt
        const parentStyle = window.getComputedStyle(module.container.parentNode);
        if (parentStyle.position === "static") {
            module.container.parentNode.style.position = "relative";
        }

        module.container.style.position = "absolute";
        module.container.style.top = module.container.offsetTop + "px";
        module.container.style.left = module.container.offsetLeft + "px";
        module.container.style.transition = `opacity ${this.config.animationSpeed}ms`;
        module.container.style.opacity = 0;
        module.container.style.pointerEvents = "none";
        module.container.style.zIndex = 999; // boven andere modules
    },

    showModuleAbsolute(module) {
        if (!module || !module.container) return;

        module.container.style.transition = `opacity ${this.config.animationSpeed}ms`;
        module.container.style.opacity = 1;
        module.container.style.pointerEvents = "auto";
    }
});
