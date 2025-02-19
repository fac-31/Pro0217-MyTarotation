import fs from "fs"

export function randomImage() {
    fs.readdir(import.meta.dirname  + '/Images', (err, stats) => {
        if (err) {
            throw err;
        } else {
            let num = Math.floor(Math.random() * stats.length);
            return stats[num];
        };
    });
};