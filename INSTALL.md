# Installing the self-hosted version of PATCH.doc

You're looking at this because you opened the free browser version of PATCH.doc
(hosted on GitHub Pages) and hit a feature that needs a server — photo/audio
attachments and PDF manual uploads. Those need somewhere to actually store the
files, which a static site can't do. The browser version also only saves to
that one browser's local storage, with no login and nothing shared between
devices.

The self-hosted Docker version has none of those limits: file uploads,
multiple users with their own patches, a shared module/manual library, and
data that lives on your own hardware instead of just one browser tab.

## Requirements

- Docker and Docker Compose
- ~100 MB disk space for the image, plus space for your data

## 1. Clone the repository

```bash
git clone https://github.com/hendrik-haehner/patch.doc.git
cd patch.doc
```

## 2. Configure `docker-compose.yml`

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

**`SESSION_SECRET`** — any long random string, used to sign session cookies. Change this before deploying — don't commit your real value to git.

## 3. Build and start

```bash
docker compose build
docker compose up -d
```

## 4. Open in browser

```
http://localhost:3000
```

Or replace `localhost` with your server's IP or hostname.

---

Once you're up and running, importing your patches from the browser version is
straightforward: in the browser version, go to **export → full backup** to
download a JSON file, then in your self-hosted instance go to **export →
import** and load that file back in.

See [README.md](README.md) for the full feature list, data layout, updating,
and reverse-proxy setup for HTTPS.
