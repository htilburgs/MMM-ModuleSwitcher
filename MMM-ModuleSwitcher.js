Module.register("MMM-ModuleSwitcher", {
    defaults: {
        moduleA: "MMM-Kermis",      // Module die we willen verbergen/tonen
        moduleB: "MMM-OnSpotify",   // Trigger module
        checkInterval: 500          // Polling interval om moduleB actief te checken
    },

    start() {
        this.moduleA = null;
        this.moduleB = null;
        this.lastModuleBState = undefined;

        // Polling
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

        // Alleen reageren bij statusverandering
        if (isActive !== this.lastModuleBState) {
            this.lastModuleBState = isActive;

            if (isActive) {
                // Trigger moduleA om te verbergen
                this.sendNotification("HIDE_KERMIS");
            } else {
                // Trigger moduleA om te tonen
                this.sendNotification("SHOW_KERMIS");
            }
        }
    }
});
