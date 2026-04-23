# hackctl Templates

This repo contains the official project templates used by `hackctl create`.

## Install hackctl

Windows x64:

```powershell
irm https://hackctl.dev/install.ps1 | iex
```

macOS Intel and Apple Silicon:

```bash
curl -fsSL https://hackctl.dev/install.sh | sh
```

Linux x64 and ARM64:

```bash
curl -fsSL https://hackctl.dev/install.sh | sh
```

Then scaffold a project:

```bash
hackctl create
```

## Available Templates

- `mern` - MongoDB, Express, React, and Node.js
- `pern` - PostgreSQL, Express, React, and Node.js
- `next-supabase` - Next.js with Supabase
- `sveltekit-supabase` - SvelteKit with Supabase
- `nuxt-supabase` - Nuxt with Supabase

Each template includes everything you need to start developing locally and deploy with `hackctl`.

## Contributing

Found a bug or have a feature request? See [CONTRIBUTING.md](./CONTRIBUTING.md).
