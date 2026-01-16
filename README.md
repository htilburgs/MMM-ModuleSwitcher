# MMM-ModuleSwitcher
MagicMirror module that switch two modules based on activity

```
cd ~/MagicMirror/modules
git clone https://github.com/htilburgs/MMM-ModuleSwitcher
cd MMM-ModuleSwitcher
npm install
```

```
{
    module: "MMM-ModuleSwitcher",
    position: "bottom_bar", // maakt niet uit
    config: {
        moduleA: "MMM-Kermis",
        moduleB: "MMM-OnSpotify",
        checkInterval: 1000
    }
},
```
