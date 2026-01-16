Module.register("MMM-ModuleSwitcher", {
    defaults: {
        moduleA: "MMM-Kermis",   // Module die je wilt verbergen
        moduleB: "MMM-OnSpotify", // Module die de trigger is
        checkInterval: 500,       // Polling interval in ms
        animationSpeed: 500       // Fade snelheid in ms
    },

    start() {
        this.moduleA = null;
        this.moduleB = null;
        this.lastModuleBState = undefined;

        setInterval(() => this.checkModuleBState(), this.config.checkInterval);
    },

    checkModuleBState() {
        const modules = MM.getModules();

        // Vind modules als ze nog niet zijn ingesteld
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

        // Alleen reageren op verandering
        if (currentState !== this.lastModuleBState) {
            this.lastModuleBState = currentState;

            if (currentState) {
                // ModuleB actief → moduleA verbergen met spacer
                this.hideModuleWithSpacer(this.moduleA);
            } else {
                // ModuleB inactief → moduleA weer tonen
                this.showModuleWithSpacer(this.moduleA);
            }
        }
    },

    hideModuleWithSpacer(module) {
        if (!module || !module.container) return;

        // Alleen één spacer maken
        if (!module.spacer) {
            const spacer = document.createElement("div");
            const rect = module.container.getBoundingClientRect();
            spacer.style.width = rect.width + "px";
            spacer.style.height = rect.height + "px";
            spacer.style.display = "inline-block";
            module.container.parentNode.insertBefore(spacer, module.container);
            module.spacer = spacer;
        }

        // Smooth fade-out
        module.container.style.transition = `opacity ${this.config.animationSpeed}ms`;
        module.container.style.opacity = 0;

        // Na fade, display none houden
        setTimeout(() => {
            module.container.style.display = "none";
        }, this.config.animationSpeed);
    },

    showModuleWithSpacer(module) {
        if (!module || !module.container) return;

        // Display terugzetten
        module.container.style.display = "";
        module.container.style.transition = `opacity ${this.config.animationSpeed}ms`;
        module.container.style.opacity = 1;

        // Spacer verwijderen
        if (module.spacer) {
            module.spacer.remove();
            module.spacer = null;
        }
    }
});
