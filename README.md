# Deicide UI

A user interface for Deicide.

## Dependencies

- [NodeJS](https://nodejs.org/)
- [Rye](https://rye-up.com/)

## Build

First build the `bundle.js`.

```bash
cd web
npm install
npm run build
```

Then setup the Python virtual environment.

```bash
cd ..
rye sync
source .venv/bin/activate
```

It can then be run as a Python module.

```bash
python -m deicide-ui
```
