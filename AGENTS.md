# AGENTS.md

## What this package is

`@sky-distribution/react-gtm-module` is a fork of `sooro-io/react-gtm-module`. It initializes Google Tag Manager (`TagManager.initialize`), pushes to the dataLayer (`TagManager.dataLayer`) and ships the `DataLayer` class that pushes the events shared by every frontend reporting to the common GTM container. The package is published to GitHub Packages.

## Publishing

The package is published from `main` by the CI workflow in `.github/workflows/main.yml`. CI bumps only the patch version. A minor or major bump is made by hand in `package.json` and `package-lock.json` (two places in the lock file) in the same pull request as the change.

## Style

Formatting comes from `.prettierrc` and `.editorconfig`: tabs (width 3), no semicolons, single quotes, print width 80, trailing commas, `arrowParens: always`. `npm run lint` must pass.

## Sources

Sources in `src/` are ES modules written as `import` plus `module.exports`, like `src/TagManager.js` and `src/utils/warn.js`. Everything public is exposed by `src/index.js`, which attaches `TagManager.DataLayer`. One class or function per file; helpers live in `src/utils/`.

## Tests

Tests live in `src/__tests__/<Module>.spec.js` and run with Jest (`npm test` runs lint and Jest). New files keep 100% line and branch coverage. Test names start with `it('should ...')`, tables use `it.each` with `$title`, and objects are compared with `toStrictEqual`.

## Comments exception

This package is a library whose public API is read through editor hints, so it declares an exception to the "no comments" standard. Every exported symbol has a JSDoc block in English with a description, `@param`, `@returns` and `@example`. The same block is kept in `src/` and in `types/index.d.ts`. The `.d.ts` file is the source, because it is what consumers read, so when the two differ, the `.d.ts` wins and `src/` is corrected. Other code has no comments.

## Documentation

`README.md` describes every public API. A new exported symbol or option needs a README entry in the same change.
