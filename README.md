# ◉ PATCH.doc

**Eurorack patch documentation — self-hosted, multi-user, Docker-based.**

PATCH.doc is a web app for documenting modular synthesizer patches. It runs as a Docker container on your own hardware (NAS, home server, VPS) and is accessible from any browser or mobile device.

![PATCH.doc Screenshot](docs/screenshot_patch.png)

---

## A note on this project

This app was created with the help of Claude (Anthropic). I myself have only fundamental coding skills — I was simply looking for a solution to my own problem and built this along the way. I hope it can be useful to others as well.

---

## Features

- **Patch canvas** — visual layout of modules with cables and connections
- **Connections tab** — dropdown-based cable editor, works on mobile without drag gestures
- **Parameters** — document knob positions, switches and settings per module
- **Performance marks** — color-mark parameters (green / yellow / red) for live performance reference
- **Notes** — freetext notes per patch
- **Media** — attach photos and audio recordings to patches
- **Manuals** — upload PDF manuals per module (shared across all users)
- **PDF export** — print-ready patch documentation (canvas + parameters + connections)
- **Global module search** — find which patches use a specific module (Cmd+F)
- **Templates** — mark patches as templates and create new patches from them
- **Shared patches** — share patches between users via a common pool
- **Dark / Light theme** — follows OS preference, manually toggleable
- **Mobile-optimized** — responsive touch UI with hamburger menu and patch dropdown
- **PWA** — installable as a home screen app on iOS and Android
- **Multi-user** — each user has their own patches and media; modules and manuals are shared
- **Admin panel** — manage users at `/admin` without restarting the container

---

## Requirements

- Docker and Docker Compose
- ~100 MB disk space for the image, plus space for your data

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/<username>/patch.doc.git
cd patch.doc
```

### 2. Configure `docker-compose.yml`

Edit `docker-compose.yml` to set your data path and users:

```yaml
services:
  patchdoc:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - /your/data/path:/data
    restart: unless-stopped
    environment:
      - PORT=3000
      - DATA_DIR=/data
      - SESSION_SECRET=change-this-to-a-random-string
      - PATCHDOC_USERS=alice:password1,bob:password2
```

**`PATCHDOC_USERS`** — comma-separated list of `username:password` pairs. The first user is automatically admin.

**`SESSION_SECRET`** — any long random string. Used to sign session cookies. Change this before deploying.

### 3. Build and start

```bash
docker compose build
docker compose up -d
```

### 4. Open in browser

```
http://localhost:3000
```

Or replace `localhost` with your server's IP or hostname.

---

## Data

All data is stored in the directory you mount to `/data`:

```
/data/
  users.json          ← user accounts
  modules.json        ← shared module library
  manuals/            ← shared PDF manuals (per module)
  sessions.json       ← login sessions (persistent across restarts)
  shared.json         ← patches shared between users
  users/
    alice/
      state.json      ← alice's patches
      media/          ← alice's photos and audio recordings
    bob/
      state.json
      media/
```

**Backup**: just copy the `/data` directory.

---

## User management

The first user in `PATCHDOC_USERS` is admin. Admins can manage users at:

```
http://localhost:3000/admin
```

From there you can add, delete and manage users without restarting the container. The admin icon (⚙) appears in the top bar for admin users.

To add the first users or change passwords you can also edit `PATCHDOC_USERS` in `docker-compose.yml` and run:

```bash
docker compose up -d
```

New users from the environment variable are added automatically on startup. Existing users are not overwritten.

---

## Updating

```bash
git pull
docker compose build --no-cache
docker compose up -d
```

Your data in `/data` is unaffected by updates.

---

## Reverse proxy (optional)

To expose PATCH.doc under a domain with HTTPS, place a reverse proxy in front of it. Example with **Caddy**:

```
patchdoc.example.com {
    reverse_proxy localhost:3000
}
```

Example with **Nginx**:

```nginx
server {
    listen 443 ssl;
    server_name patchdoc.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 150m;
    }
}
```

Make sure to set `client_max_body_size` high enough for PDF and media uploads.

---

## Synology NAS

On a Synology NAS, use the built-in reverse proxy under:

**DSM → Control Panel → Login Portal → Advanced → Reverse Proxy**

Set the source to your domain and the destination to `localhost:3000`.

---

## Tech stack

- **Backend** — Node.js with Express, no database (JSON files)
- **Frontend** — Vanilla JS, no framework
- **Storage** — local filesystem via Docker bind mount
- **Auth** — session cookies, passwords stored in `users.json`

---

## License

MIT
