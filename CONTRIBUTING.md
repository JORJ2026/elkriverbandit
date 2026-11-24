# Contributing

Bug reports and ideas are welcome — use the issue templates.

Local development needs only Node 18+:

```bash
npm run serve     # play at http://localhost:8080
npm run check     # syntax, references, song list
npm run desktop   # run the Electron wrapper (installs deps first)
```

Adding a song: drop `audio/<id>.mp3`, add `<id>` to `songList` in `app.js` **and** to `BIG` in `sw.js`, then run `npm run check`.
