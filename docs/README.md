# CV Buddy documentation

CV Buddy is a free, open-source, browser-based CV editor. Its core behavior is direct editing of the final document: users can type, continue bullet lists, copy formatted blocks, and use native undo without switching between an editor and a preview.

Start here before changing the homepage, editor, templates, or saved-draft format.

| Guide | What it covers |
| --- | --- |
| [Product and UX decisions](UX_DECISIONS.md) | The intended experience and decisions future changes must preserve |
| [Architecture](ARCHITECTURE.md) | Files, initialization, storage, typography, printing, and feedback |
| [Development](DEVELOPMENT.md) | Running locally, adding templates, updating previews, and troubleshooting |
| [Testing](TESTING.md) | Regression checks for native editing, persistence, print fidelity, typography, and the homepage |
| [Contributing](CONTRIBUTING.md) | Contribution workflow and implementation rules |

## Current template defaults

Each template defines its own font choices and recommended size. Recommendations are the defaults for a fresh draft, not a reason to overwrite an existing user's settings.

| Template | Directory | Recommended size | Recommended font | Other font choices |
| --- | --- | --- | --- | --- |
| Classic | `iitkgp/` | Small | Open Sans | Arial, Georgia |
| Contemporary | `iitm/` | Medium | Arial | Varela Round, Georgia |
| Editorial | `iitb/` | Medium | EB Garamond | Times New Roman, Arial |

## Repository conventions

The project introduction stays in the root [README](../README.md), and the complete license stays in [LICENSE.md](../LICENSE.md). Contributor and developer documentation lives here in `docs/`. The website entry point remains the root `index.html`; `docs/` is not the application or a separate hosting root.

Keep these guides current when changing behavior. In particular, update the storage description for schema changes and the testing checklist for changes to native editing or printing.
