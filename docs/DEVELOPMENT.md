# Development

CV Buddy runs directly from static files. Use the [architecture guide](ARCHITECTURE.md) for file ownership and data formats, and read the [UX decisions](UX_DECISIONS.md) before changing the interface.

## Run locally

Open the root `index.html` in a browser. Open `iitkgp/index.html`, `iitm/index.html`, or `iitb/index.html` to go directly to an editor. There is no install or build command.

If a local HTTP origin is useful, run this from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8000/` and stop the server with Ctrl + C. A server is optional; do not leave one running when the person working on the project requests direct file access instead.

Use the same browser and URL to return to saved drafts. Opening a file directly and serving it through localhost may expose different browser storage. Internet access is needed for uncached Google Fonts and for feedback delivery. The editor can still work with fallback fonts offline.

## Change the editor

Keep document behavior in `editor.js` and shared editor styles in `editor.css`. Preserve a single editing host on `#cv`. Use native `input` events for saving; do not rebuild the live document after each keystroke.

Controls belong outside `#cv`. This prevents toolbar elements from being copied, saved, or printed as part of the resume. Put secondary controls in Options so the CV stays close to the top of the screen.

Changes to the draft schema require a migration path. Keep the existing storage keys and continue reading older HTML-string drafts. Check recovery copies as well as current drafts. Reset must never discard the current draft if its recovery copy cannot be written.

## Change a template

A template's `index.html` holds its fictional sample profile. Its `styles.css` defines the original document design, and its `main.js` supplies the editor name, storage key, and typography recommendations.

Keep samples internally consistent: institute name, qualification, dates, and projects should make sense together. Use reserved example email addresses rather than real contact details. Existing saved drafts take precedence over changed sample HTML; use a fresh browser context or a deliberate reset to inspect new samples.

Keep `#cv` as the document root. `.header`, `.section-heading`, table elements, and the existing list structure connect the content to template and size-preset styling. Optional photo controls use `#previewImage`; its containing `#imageDiv` collapses when the photo is hidden. A header image other than `#previewImage` is treated as the institute logo.

## Add a template

1. Copy the `template/` scaffold into a new directory and fill in the document sections.
2. Add the template's stylesheet, preserving usable screen and print output.
3. Give its initialization a unique storage key and a readable display name.
4. Configure three font choices, `legacyFont`, `recommendedFont`, and `recommendedSize`. If needed, add font stacks and role-size variables in `editor.css`.
5. Add a card to the homepage and create a screenshot of the actual recommended default.
6. Add the template to the documentation tables and run the [regression checks](TESTING.md).

The starter editor has default typography configuration so it can run before custom options are supplied, but a finished template should explicitly define its recommendations.

## Change typography

The template initialization chooses recommendations; CSS defines the font stacks and role sizes. Keep these responsibilities separate so each template can offer different fonts and defaults.

Use Small, Medium, and Large presets. Do not add a granular point-size field or bring back a page-zoom toggle. Size presets affect text layout and can change the number of printed pages. Automatic fitting changes only the display scale.

When changing a font option, update its identifier consistently in initialization and CSS, and account for drafts that may contain the old identifier. Include a generic fallback in each stack. The styled picker must retain its combobox/listbox roles, selected state, recommendation badge, and keyboard behavior.

Font and size rules apply equally on screen and in print. Verify titles, section headings, table text, bullets, and contact details instead of checking only the root element.

## Update template previews

Homepage previews are PNG screenshots in `img/templates/`:

| Template | Image |
| --- | --- |
| Classic | `classic.png` |
| Contemporary | `contemporary.png` |
| Editorial | `editorial.png` |

Use a fresh draft with the template's recommended settings. Wait for fonts and images to load, then capture the actual `#cv` element at full document width. Exclude the sticky toolbar and any open menu or notice. Do not remove arbitrary font/style rules just for the screenshot. Keep the image's aspect ratio intact on the homepage.

A browser automation tool can capture an element even though the interface has no explicit Actual size option. At a desktop viewport wider than the document, automatic fitting is already at a scale of one.

## Feedback form changes

Keep the `name` attributes for `name`, `email`, `mobile`, `subject`, and `message` aligned with the backend contract. Preserve optional contact fields and required subject/message fields. Test with intercepted requests; do not send fabricated feedback to the live deployment.

The delivery implementation belongs in contributor docs, not in the form's explanatory text. The GitHub issue link provides an alternative feedback channel.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Old sample content still appears | A saved draft is being loaded. Check the origin and storage key; export anything valuable before resetting. |
| A draft appears missing | Check browser profile, local-file versus HTTP access, hostname, port, private browsing, and cleared storage. |
| Not saved | Browser storage may be blocked or full. Keep the tab open and export a PDF before investigating. Images contribute to storage size. |
| Draft needs attention | The stored value could not be decoded. Preserve the raw value. Reset stores a recovery copy before loading the sample. |
| Template colors or wrapping change in print | Compare computed styles for the document and descendants. Check shared geometry, font loading, print overrides, A4, scaling, and browser header/footer settings. |
| Font looks different on another device | Check Google Fonts loading and the configured local fallback stack. |
| Enter does not add a bullet | Inspect editing hosts. Only `#cv` should have `contenteditable="true"`; remove nested editing regions or Enter handlers. |
| Pasted blocks lose formatting after reload | Check `cleanHTML()`, preset rules, and the stored HTML. Preserve rich-text structure and emphasis while applying the chosen typography preset. |
| AI assistant cannot edit a local file | Browser-extension access depends on the extension and browser permissions. Users can also generate text in the assistant and paste it themselves. |

## Hosting and repository layout

The application is suitable for static hosting. The project README links to its GitHub Pages URL, but hosting configuration and the feedback backend are not defined by an application server in this repository. Do not assume local changes are deployed.

Keep the root `index.html` as the site entry point. Keep the root README and license discoverable, and put contributor knowledge in `docs/`. Use relative links so the application and documentation continue working in a checkout and under the repository's hosted subpath.
