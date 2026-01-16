Module.register("MMM-ModuleSwitcher", {
    defaults: {
        moduleA: "MMM-Kermis",      // Module die we willen verbergen
        moduleB: "MMM-OnSpotify",   // Trigger module
        checkInterval: 500          // Polling interval
    },

    start() {
        this.moduleA = null;
        this.moduleB = null;
        this.lastModuleBState = undefined;
        this.spacer = null;

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
                this.hideModuleWithSpacer(this.moduleA);
            } else {
                this.showModuleWithSpacer(this.moduleA);
            }
        }
    },

    hideModuleWithSpacer(module) {
        if (!module || !module.container || module.spacer) return;

        // Maak een spacer van dezelfde hoogte
        const spacer = document.createElement("div");
        const rect = module.container.getBoundingClientRect();
        spacer.style.width = rect.width + "px";
        spacer.style.height = rect.height + "px";
        spacer.style.display = "block";

        module.container.parentNode.insertBefore(spacer, module.container);
        this.spacer = spacer;

        // Verberg module via notificatie
        if (typeof module.hideOnNotification === "function") {
            module.hideOnNotification();
        } else {
            module.visible = false;
            module.container.style.display = "none";
        }
    },

    showModuleWithSpacer(module) {
        if (!module || !module.container) return;

        // Toon module via notificatie
        if (typeof module.showOnNotification === "function") {
            module.showOnNotification();
        } else {
            module.visible = true;
            module.container.style.display = "";
        }

        // Verwijder spacer
        if (this.spacer) {
            this.spacer.remove();
            this.spacer = null;
        }
    }
});
