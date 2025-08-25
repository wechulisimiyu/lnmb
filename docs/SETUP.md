# Setup — LNMB (Leave No Medic Behind)

This document explains how to set up the LNMB website locally on Linux and Windows. It covers cloning, dependencies, environment variables, and running the development server.

## Prerequisites

- Git
- Node.js (recommended via nvm on Linux / Node installer on Windows)
- pnpm (preferred package manager)

## Clone the repo

```bash
git clone git@github.com:wechulisimiyu/lnmb.git
cd lnmb
```

If you don't have SSH set up, use the HTTPS URL but SSH is preferred for pushing and making PRs. I would rather you do SSH haha.

## Install Node (recommended)

I set up with Node v22. Install Node via nvm so you can manage multiple versions.

### Linux / macOS (nvm)

1. Install or update Node.js (recommended via nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 22
nvm use 22
```

2. Install pnpm (choose one):

Option A: via npm

```bash
npm install -g pnpm
```

Option B: via pnpm standalone installer

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

3. Verify installation:

```bash
node -v
pnpm -v
```


### Windows

1. Install Node.js from https://nodejs.org/en/
 (choose the v22 installer if available).

2. Install pnpm globally:

 ```bash
 npm install -g pnpm
 ```
3. Verify

```bash
node -v
pnpm -v
```

## Install dependencies

We use pnpm for dependency management:

```bash
pnpm install
```


## Environment variables

If the project requires environment variables (for Convex or external services), copy the provided sample and create a local file:

```bash
cp env.sample .env.local
```

Then open `.env.local` and fill in values. Example Convex variables you may need (see `env.sample`):

```env
# CONVEX_DEPLOYMENT=
# NEXT_PUBLIC_CONVEX_URL=
```

## Run the dev server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Notes & troubleshooting

- If you only want to make frontend changes without backend dependencies, ensure any server calls are mocked or the backend connectors (Convex) are disabled or configured to point to a test instance.
- If you see TypeScript or lint errors, run the type checks or linter directly:

```bash
pnpm build
pnpm lint
```

## Other

- Original project README (legacy Node/Express/Mongo implementation):

	https://github.com/wechulisimiyu/leave-no-medic-behind/blob/dev/README.md (legacy project)

## Contributing

1. Fork the repository
2. Create a branch for your change
3. Make changes and commit
4. Push and open a PR describing the change

Thanks for helping LNMB — leave no medic behind.
