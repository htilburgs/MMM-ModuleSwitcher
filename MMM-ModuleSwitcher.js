Module.register("MMM-ModuleSwitcher", {
    defaults: {
        moduleA: "MMM-ModuleA",
        moduleB: "MMM-ModuleB",
        checkInterval: 1000, // ms
        animationSpeed: 500
    },

    start() {
        Log.info("Starting module: " + this.name);
        this.moduleAInstance = null;
        this.moduleBVisible = false;

        setInterval(() => {
            this.checkModules();
        }, this.config.checkInterval);
    },

    checkModules() {
        const modules = MM.getModules();

        // Zoek module A
        if (!this.moduleAInstance) {
            this.moduleAInstance = modules.find(m => m.name === this.config.moduleA);
        }

        // Check of module B zichtbaar is
        const moduleB = modules.find(m =>
            m.name === this.config.moduleB && m.hidden === false
        );

        if (moduleB && !this.moduleBVisible) {
            this.moduleBVisible = true;
            this.hideModuleA();
        }

        if (!moduleB && this.moduleBVisible) {
            this.moduleBVisible = false;
            this.showModuleA();
        }
    },

    hideModuleA() {
        if (this.moduleAInstance) {
            Log.info("Hiding " + this.config.moduleA);
            this.moduleAInstance.hide(this.config.animationSpeed);
        }
    },

    showModuleA() {
        if (this.moduleAInstance) {
            Log.info("Showing " + this.config.moduleA);
            this.moduleAInstance.show(this.config.animationSpeed);
        }
    }
});
