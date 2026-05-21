# Changelog

All notable changes to this project are documented in this file.

## [Unreleased] - 2026-05-21

This is the first release as an independent fork of [MaddyDev-glitch/iperf3-webui](https://github.com/MaddyDev-glitch/iperf3-webui).

### Added
- **Bidirectional (bidir) testing mode** — Full `--bidir` support with a dedicated FAST.com-style UI showing simultaneous upload and download speeds, including per-direction averages.
- **Bidir UI section** — New HTML/CSS layout with download/upload indicators, live speed values, and stats grid (avg download, avg upload).
- **Bidir state management** — Added `bidirDownloadSum`, `bidirDownloadCount`, `bidirUploadSum`, `bidirUploadCount` to the application state with a unified `resetStats()` method.
- **Bidir button** — Three-column mode toggle (Upload / Download / Bidir) replacing the previous two-column layout.
- **Bidir backend streaming** — Dedicated server-side event stream parser for `--bidir` output, correctly routing `[TX-C]` and `[RX-C]` SUM lines to upload and download channels.
- **Dockerfile** — New `Dockerfile` (replacing the previous `Containerfile`) based on `python:3` with `iperf3` installed via apt.
- **docker-compose.yml** — Added a ready-to-use Compose file with build context, port mapping, and `env.yaml` volume mount.
- **GitHub Actions CI/CD** — New `.github/workflows/docker-build.yml` workflow to automatically build and push the Docker image to GHCR on every push to `main`.

- **Display mode configuration** — New `display_mode` setting in `env.yaml` (`gauge`, `counter`, or `both`) controls how Upload/Download results are displayed: as a speedometer gauge, a FAST.com-style numeric counter, or with a user toggle between both. When set to `both`, a Gauge/Counter toggle appears below the active display section. Bidir mode always uses the counter display regardless of this setting.

### Fixed
- **Average and Maximum not shown in Upload/Download mode** — The completion signal (negative value) triggered an early return before the average and maximum stats were written to the DOM. Moved the avg/max calculation into the completion handler so they are now correctly displayed when a test finishes.

### Changed
- **README.md** — Complete rewrite in English; added fork notice, updated feature list to include bidir mode and Docker support, added changelog reference, cleaned up formatting.
- **LICENSE** — Updated copyright holder to reflect the fork.
- **CSV server list URL** — Updated the public iPerf3 server list endpoint to `http://export.iperf3serverlist.net/listed_iperf3_servers.csv`.
- **Docker image name** — Ensured lowercase image name in the GitHub Actions workflow for GHCR compatibility.
- **docker-compose.yml** — Switched from `network_mode` to explicit `ports` mapping.
- **Footer** — Updated footer credit from "Made with 💜 by MaddyDev-glitch" to "Forked with 💜 by R0GGER/iperf3-webui" with a link to the fork repository.
- **Version badge removed** — Removed the hardcoded version badge and GitHub tag image from the header for a cleaner UI.
- **Unit display** — Units now update across all `.units` elements (including the bidir section) when the user changes the unit selection.
- **Mode toggle refactored** — Replaced separate upload/download button handlers with a unified `setMode()` function that toggles visibility between the gauge and bidir sections.
- **runTest.js refactored** — Split the monolithic `onmessage` handler into dedicated `handleBidirData()` and `handleNormalData()` functions for better readability and maintainability.
