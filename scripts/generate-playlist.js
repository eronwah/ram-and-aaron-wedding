const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const musicDirectory = path.join(projectRoot, 'assets', 'music');
const playlistFile = path.join(musicDirectory, 'playlist.json');
const supportedExtensions = new Set(['.mp3', '.m4a', '.ogg', '.wav', '.aac']);

fs.mkdirSync(musicDirectory, { recursive: true });

const tracks = fs.readdirSync(musicDirectory, { withFileTypes: true })
    .filter(entry => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
    .map(entry => {
        const fileName = entry.name;
        const titleAndArtist = path.basename(fileName, path.extname(fileName));
        const separatorIndex = titleAndArtist.indexOf(' - ');
        const title = separatorIndex > 0 ? titleAndArtist.slice(0, separatorIndex).trim() : titleAndArtist;
        const artist = separatorIndex > 0 ? titleAndArtist.slice(separatorIndex + 3).trim() : '';
        const encodedFileName = encodeURIComponent(fileName);

        return {
            title,
            artist,
            src: `assets/music/${encodedFileName}`
        };
    })
    .sort((first, second) => first.title.localeCompare(second.title));

fs.writeFileSync(playlistFile, `${JSON.stringify(tracks, null, 2)}\n`, 'utf8');
console.log(`Generated music playlist with ${tracks.length} track(s).`);
