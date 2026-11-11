# AWS staging environment

The app runs live at **https://mentorandme.com** on one AWS server.
Health check: https://mentorandme.com/api/health

Set up November 1, 2026 by Oveld. Only Oveld changes AWS settings; ask before changing anything in the console.

## What's running

```
Browser ──HTTPS──> Caddy (ports 80/443, Let's Encrypt)
                     └─> frontend (nginx :8080) ──/api/*──> backend (FastAPI :8000) ──> db (Postgres 16)
                         └──────────── Docker Compose, /opt/mentorme ────────────┘
```

| Piece | Value |
|---|---|
| AWS account / region | Rubber Ducking, **US East (Ohio) us-east-2** |
| Server | EC2 `mentorme-staging`, t3.small, Ubuntu 24.04, 20 GiB encrypted disk, 2 GB swap |
| Public IP | Elastic IP 77.112.45.1 |
| Firewall | Security group `mentorme-web`: inbound 80 and 443 only. SSH is closed |
| Server access | AWS Session Manager (browser terminal), no SSH keys |
| Domain / DNS | `mentorandme.com` and `www` → A records in Route 53 |
| HTTPS | Caddy, config in `/etc/caddy/Caddyfile`; `www` redirects to the main domain |
| Code on server | `/opt/mentorme`, cloned with a read-only GitHub deploy key |
| Secrets | `/opt/mentorme/.env` on the server only (random DB password). Never commit it |
| Backups | Data Lifecycle Manager: daily disk snapshot at 1 a.m. Pacific, last 7 kept |

### Region rule

An organization policy only allows servers in **Ohio**. In N. Virginia or Oregon the EC2 console shows
"not authorized" or "AMI not valid" errors. Always check the region in the top-right corner.

## Connect to the server

1. AWS access portal → **Rubber Ducking** → AdministratorAccess. Region: **Ohio**.
2. EC2 → **Instances** → tick `mentorme-staging` → **Connect**.
3. Choose **SSM Session Manager** → **Connect** (ignore the "Port 22" warning on the other option).
4. In the terminal: `bash`, then `cd /opt/mentorme`.

## Deploy the latest code

```bash
git pull
docker compose up --build -d --wait
curl -s https://mentorandme.com/api/health; echo
```

Takes 2–4 minutes; the database is not touched. If the browser shows the old site, hard-refresh (Cmd/Ctrl + Shift + R).

## Check health

```bash
docker compose ps                       # db, backend, frontend healthy; migrate "exited" is normal
curl -s https://mentorandme.com/api/health; echo   # expect "status":"ok", "reachable":true
```

## Logs and restarts

| Task | Command |
|---|---|
| Backend logs | `docker compose logs backend --tail 50` |
| Database logs | `docker compose logs db --tail 50` |
| Frontend logs | `docker compose logs frontend --tail 50` |
| Caddy logs | `sudo journalctl -u caddy -n 50 --no-pager` |
| Restart the app | `docker compose restart` |
| Start after a server reboot | `docker compose up -d --wait` |
| Reload Caddy after editing the Caddyfile | `sudo systemctl reload caddy` |

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Not authorized … service control policy" in the console | Switch region to **Ohio** |
| Session Manager Connect greyed out | Server just started; wait 2–3 min and refresh |
| `permission denied … docker.sock` | Open a new Session Manager session |
| Site down after a server restart | `cd /opt/mentorme && docker compose up -d --wait` |
| Health shows `"degraded"` | `docker compose logs db --tail 50`, then `docker compose up -d --wait` |

## Restore from a backup

EC2 → **Snapshots** → pick by date → **Create image from snapshot** → launch it with the same settings
→ move the Elastic IP 77.112.45.1 to the new instance → connect and run `docker compose up -d --wait`.

## Cost

About $21/month (server ~$15.20, public IP ~$3.65, disk $1.60, DNS $0.50, snapshots <$1) plus the
domain at $16/year. A $25/month budget alert emails the team. To save money between demos,
stop the instance (EC2 → Instance state → Stop); start it and run `docker compose up -d --wait` to bring it back.

## Known gaps

- [ ] Add `restart: unless-stopped` to `db`, `backend`, `frontend` in `compose.yaml` so the app survives reboots.
- [ ] Switch the database image to `pgvector/pgvector:pg16` before the recommendation engine needs embeddings.
- [ ] Create a `main` branch with protection (1 review + passing CI).
- [ ] Auto-deploy to the server on merge to `main` (GitHub Actions).
