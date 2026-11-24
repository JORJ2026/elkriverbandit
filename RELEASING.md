# Releasing Elk River Bandit

## One-time setup (≈10 minutes)

1. **Create the repo.** On GitHub create an empty **public** repo named `elk-river-bandit` under your account (`jorj2026`).
   *Different name or account?* Change it in: `config.js` (`repo`, `siteUrl`), `README.md`, `native/electron/package.json` (`homepage`), `store/listing.md`, `info/support.html`/`privacy.html` links if you added any, and the `jorj2026` bits of the app id (`io.github.jorj2026.elkriverbandit` in `native/electron/package.json`, `native/capacitor/capacitor.config.json`, the `java/io/github/jorj2026/...` path in `.github/workflows/release.yml`, and the `package` line of `native/capacitor/overrides/MainActivity.java`).
2. **Push this folder:**
   ```bash
   git init -b main && git add . && git commit -m "Elk River Bandit 1.0.0"
   git remote add origin https://github.com/jorj2026/elk-river-bandit.git
   git push -u origin main
   ```
3. **Turn on the website:** repo → *Settings → Pages → Build and deployment → Source: **GitHub Actions***.
   The *Deploy web game* workflow runs on every push to `main`; your game appears at `https://jorj2026.github.io/elk-river-bandit/`.
4. **Allow releases:** *Settings → Actions → General → Workflow permissions → Read and write permissions* (the release job creates the GitHub Release).

## Cut a release

```bash
# 1. update CHANGELOG.md (add a "## [1.0.0] — date" section) and commit
git tag v1.0.0
git push origin v1.0.0
```
Open the **Actions** tab. The *Release* workflow builds Windows, macOS, Linux, Android, iPhone (IPA) and a web zip in parallel
(~15–25 min) and attaches everything to *Releases → v1.0.0*. The in-game ⚙️ Settings → Download tab and the README links then work automatically.
You can also run it by hand: *Actions → Release → Run workflow* and type a version.

Files produced:

| File | For |
|---|---|
| `Elk-River-Bandit-X-Windows-Setup.exe` / `-Windows-Portable.exe` | Windows 10+ |
| `Elk-River-Bandit-X-macOS.dmg` | macOS 11+ (Apple silicon + Intel) |
| `Elk-River-Bandit-X-Linux.AppImage` / `-Linux.deb` | Linux x64 |
| `Elk-River-Bandit-X-Android.apk` / `-Android.aab` | sideload / Google Play |
| `Elk-River-Bandit-X-iOS-unsigned.ipa` | sideloading tools (AltStore, Sideloadly) |
| `Elk-River-Bandit-X-Web.zip` | self-hosting |

The in-game download buttons find files by these name endings — keep them if you edit `electron-builder` settings.

## Optional: signing (removes scary warnings)

| Platform | What you need | Repo secrets |
|---|---|---|
| **Android (do this before your first public APK)** | A permanent keystore, otherwise each release is signed with a throw-away key and can’t update the previous install. `keytool -genkeypair -v -keystore release.jks -alias erb -keyalg RSA -keysize 2048 -validity 10000` then `base64 -w0 release.jks` | `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (use the same password for key + store) |
| macOS | Apple Developer account ($99/yr), “Developer ID Application” certificate exported as .p12 (+ notarization setup, see electron-builder docs) | `MAC_CSC_LINK` (base64 .p12), `MAC_CSC_KEY_PASSWORD` |
| Windows | A code-signing certificate (EV certs remove SmartScreen warnings immediately) — add `CSC_LINK`/`CSC_KEY_PASSWORD` env to the desktop job | — |
| iPhone | Apple Developer account → provisioning profile → change the iOS job to a signed archive and upload to TestFlight/App Store | — |

Keep `release.jks` out of git (it’s in `.gitignore`) and back it up — losing it means Android users must uninstall to update.

## Stores
`store/listing.md` has ready-to-paste text; `store/feature-graphic.png` and `store/screenshots/` are the images.
Google Play wants the `.aab` + a one-time $25 developer fee; Apple wants a paid account and a signed build.

## If a build fails
Open the failed job’s log. The desktop jobs are independent (`fail-fast: false`) and Android/iOS are `continue-on-error`, so one broken platform won’t block the others — fix, delete the tag (`git tag -d v1.0.0 && git push origin :refs/tags/v1.0.0`), retag, push again.
Run `npm run check` locally first; it catches missing files and a song list that’s out of sync.
