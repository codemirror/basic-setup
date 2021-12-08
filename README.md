# codemirror-pluto-setup

[Pluto](https://github.com/fonsp/Pluto.jl) uses the awesome codemirror 6, but Pluto is 'buildelss', which means that we need to import dependencies directly from the jsdelivr CDN. Codemirror 6 is not meant to work in this setup. Using tools such as https://esm.sh/ , https://www.jsdelivr.com/esm or https://www.skypack.dev/ does not work in our case, because:

- downstream dependencies cannot be version-pinned easily. For pluto we want to version-pin everything.
- the modular design of codemirror 6 requires multiple modules to use the same version/instance of shared dependencies, such as `@codemirror/state`. This is hard/impossible with ES building CDNs.

This is why we have this repository to manage our dependencies and to export a single `.es.js` and `.d.ts` file.

# How to update

1. `npm install`
1. Change the `basic-setup.ts` file.
1. `npm run bundle`

# How to release and update pluto

1. `npm run bundle`
2. Change the `package.json` patch version number +1 (`npm version patch`)
3. git commit etc
4. Go here: https://github.com/JuliaPluto/codemirror-pluto-setup/releases/new
5. For tag name, type in the new version number (without `v`) and select "create new tag on publish"
6. Type version name (without `v`) as release title
7. Release
8. In Pluto: update `frontend/imports/CodemirrorPlutoSetup.js` with the new version number.
9. Copy the contents of `dist/index.d.ts` and In Pluto: paste into `frontend/imports/CodemirrorPlutoSetup.d.ts`. Save without formatting.
10. git commit etc

## To test something inside pluto without publishing a version:

1. `npm run bundle` and commit to a new branch. Get the commit hash, e.g. `bab65fc`
2. In Pluto, use the commit hash as your version number, e.g.

```js
import { ... } from "https://cdn.jsdelivr.net/gh/JuliaPluto/codemirror-pluto-setup@bab65fc/dist/index.es.min.js"
```

@dralletje also knows a way to do this locally, without having to commit & copy the patch number.
