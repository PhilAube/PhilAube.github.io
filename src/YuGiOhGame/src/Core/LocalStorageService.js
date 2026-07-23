export default class LocalStorageService {
    get(key, defaultValue) {
        const value = localStorage.getItem(key);
        if (value === "undefined") {
            return null;
        }
        return JSON.parse(value);
    }

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}
