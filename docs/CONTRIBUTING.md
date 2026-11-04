# Contributing

Read the [documentation index](README.md), especially the [product and UX decisions](UX_DECISIONS.md), before changing the editor. CV Buddy's main feature is editing the final document directly, with native browser rich-text behavior and consistent print styling.

## Issues and pull requests

Follow the repository's [issue template](../issue_template.md) and [pull request template](../pull_request_template.md). Explain the user-visible behavior changed and how it was verified. Keep unrelated changes separate from the requested work.

## Development

There is no build step. Open `index.html` directly, or follow the optional local-server instructions in [Development](DEVELOPMENT.md). Use the [template directory](../template/) as the starting point for a new CV design.

- Put shared editor behavior in `editor.js` and shared editor styling in `editor.css`.
- Preserve one rich-text editing host on `#cv`. Do not replace native lists, clipboard behavior, or undo with independent fields.
- Preserve draft storage keys and older formats. Test migrations and reset recovery when changing persistence.
- Keep screen and print document styles aligned. Typography presets must apply equally to both.
- Configure font choices and recommendations per template rather than hard-coding one default for all templates.
- Keep optional name, email, and mobile inputs in the upfront feedback form.
- Update the relevant guides and template thumbnails when behavior or defaults change.

Run the applicable checks in [Testing](TESTING.md), including native Enter/copy/paste, saving and reload, typography, reset recovery, and printing. Use isolated test drafts and mocked feedback requests.
