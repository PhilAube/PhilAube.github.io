export default class Settings
{
    static LOCAL_STORAGE_KEY = "MontrealSimulatorSettings";

    constructor()
    {
        this.currentLevel = 1;
        this.muteSound = false;
        this.muteMusic = false;
        this.totalDistance = 0;
        this.highScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        if (Settings.LOCAL_STORAGE_KEY in localStorage) this.loadSettings();
        else this.saveSettings();
    }

    loadSettings()
    {
        let encoded = localStorage.getItem(Settings.LOCAL_STORAGE_KEY);
        let savedJSON = atob(encoded);

        let settings;

        try // In case the user messes with the localStorage
        {
            settings = JSON.parse(savedJSON);

            this.currentLevel = settings.currentLevel;
            this.muteSound = settings.muteSound;
            this.muteMusic = settings.muteMusic;
            this.totalDistance = settings.totalDistance;
            this.highScores = settings.highScores;
        }
        catch
        {
            alert("Oops! Unfortunately, your saved data was corrupted. \nProgress has to be reset.");
            
            this.currentLevel = 1;
            this.muteSound = false;
            this.muteMusic = false;
            this.totalDistance = 0;
            this.highScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            this.saveSettings();
        }
    }

    saveSettings()
    {
        let json = JSON.stringify(this);
        let encoded = btoa(json);
        localStorage.setItem(Settings.LOCAL_STORAGE_KEY, encoded);
    }

    checkCorruption()
    {
        this.loadSettings();
        this.saveSettings();
    }
}