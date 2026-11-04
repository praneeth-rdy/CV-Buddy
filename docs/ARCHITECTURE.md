# Architecture

CV Buddy is a static HTML, CSS, and JavaScript application. It has no application server, database, framework, package installation, or build step. The public URL referenced by the project is `https://praneeth-rdy.github.io/CV-Buddy`.

## Files and responsibilities

| Files | Responsibility |
| --- | --- |
| [`index.html`](../index.html) | Homepage, template links, optional contact fields, and feedback form |
| [`styles.css`](../styles.css) | Compact homepage and responsive form layout |
| [`main.js`](../main.js) | Feedback submission and status feedback |
| [`ui.css`](../ui.css) | Shared palette, buttons, typography for the interface, and focus styles |
| [`global.css`](../global.css) | Legacy base document styles and print visibility rules |
| [`editor.js`](../editor.js) | Shared editor initialization, native editing host, autosave, typography controls, photos, help, recovery, and printing |
| [`editor.css`](../editor.css) | Compact editor interface, document geometry, role-based typography, font choices, and print rules |
| `iitkgp/`, `iitm/`, `iitb/` | One sample document, original template stylesheet, and editor initialization per template |
| [`template/`](../template/) | Starter scaffold for contributors adding another template |
| [`img/templates/`](../img/templates/) | Generated screenshots used as homepage thumbnails |
| [`img/profile-placeholder.svg`](../img/profile-placeholder.svg) | Placeholder when the optional profile photo is shown |
| `img/logo/`, `img/ProfileImg/` | Existing logo and sample image assets |
| [`global.js`](../global.js) | Legacy jQuery editing handlers; current homepage and template pages do not load this file |

Current pages do not require jQuery, Bootstrap JavaScript, or Font Awesome. The original template fonts still load through their Google Fonts imports. System font choices have fallback stacks.

## Editor initialization

Each template calls `CVBuddyEditor.init()` with its storage key, display name, and typography configuration. Its HTML contains `#cv` with the sample content, followed by the shared editor script and the local initialization script.

Initialization retains the original sample HTML for reset, attempts to load the saved draft, then replaces the surrounding page container with the compact editor interface. The existing `#cv` node is moved into the document viewport and made a single rich-text editing host.

Editing changes produce native `input` events. The handler marks the draft dirty, refreshes image-control availability, and schedules a save after 650 ms without further input. Saving serializes a separate HTML representation; it does not rewrite the live DOM. This preserves the caret and native undo history while typing.

The Options menu contains the styled font picker, size buttons, conditional logo/photo controls, Save now, Editing help, and reset/recovery actions. Font selection uses a select-only ARIA combobox and listbox, with arrow keys, Home/End, Enter/Space, Escape, Tab, and letter search.

## Saved drafts

Storage uses `localStorage` on the current browser origin. Each template has an independent draft:

| Template | Storage key | Original font for legacy drafts |
| --- | --- | --- |
| IIT Kharagpur | `iitkgpCvData` | Open Sans |
| IIT Madras | `iitmCvData` | Varela Round |
| IIT Bombay | `iitbCvData` | EB Garamond |
| Starter | `clgnameCvData` | Arial |

The current value is JSON with this shape:

```json
{
  "version": 2,
  "html": "<section class=\"header\">...</section>",
  "appearance": {
    "size": "small",
    "font": "open-sans"
  }
}
```

Earlier versions stored a JSON-encoded HTML string. `decodeDraft()` accepts both shapes. A legacy draft gets medium sizing and its original template font, then upgrades to version 2 on the next save. Invalid size/font identifiers in version 2 fall back to the template's recommendations. Empty HTML is a valid blank draft.

`cleanHTML()` removes executable markup, event handlers, and editing UI attributes from the stored document. It retains document structure, rich-text tags, supported inline presentation properties, and supported links/images. It operates on a parsed copy, not the live editing host. Changes to this cleanup must be checked against block copy/paste and formatting persistence.

Save is also available through Options and Ctrl/Cmd + S inside the CV. Pending edits are saved when the document becomes hidden and before leaving. A failed save leaves the draft dirty, displays a warning, and requests the browser's unsaved-changes protection on navigation.

There is one draft per template, not multiple named documents or a cloud account. Separate browsers, origins, and file URLs may use different stores. Private browsing, quota limits, or clearing site data can remove or prevent persistence. There is no cross-tab conflict resolution; avoid editing the same template in multiple tabs.

## Reset and recovery

The recovery key is the draft key plus `:beforeReset`. Reset first stores the current version 2 draft, including appearance settings. If the existing stored value could not be read, reset preserves that raw value instead. If writing the recovery copy fails, reset is canceled.

A successful reset restores the HTML sample and that template's recommended typography. Restore before last reset loads both content and appearance from the recovery value. It can also read a legacy HTML-string backup. Recovery is one level deep; another reset replaces the previous recovery copy.

An unreadable current draft pauses autosave to avoid overwriting the stored data. An unreadable backup cannot be restored through the UI. Preserve the raw value when investigating it.

## Typography configuration

Typography configuration lives in each template's `main.js`:

- `recommendedSize`: `small`, `medium`, or `large` for a new draft or reset.
- `recommendedFont`: a font identifier from that template's choices.
- `legacyFont`: the template's original font for HTML-only drafts.
- `fonts`: three `{ id, label }` choices shown in the font picker.

`#cv` receives `data-size` and `data-font`. CSS applies these settings to the entire document. Inline bold, italic, underline, and supported colors remain available, while the selected size/font preset establishes the overall hierarchy.

Medium uses the role sizes below. Small multiplies them by `0.875`; Large multiplies them by `1.125`. These factors change font sizes, not document width or screen zoom.

| Text role | Classic medium | Contemporary medium | Editorial medium |
| --- | --- | --- | --- |
| Main title/name | 26 px | 38 px | 16 px |
| Section heading | 20 px | 24 px | 18 px |
| Institute subtitle | 20 px | 24 px | 16 px |
| Body and bullets | 16 px | 16 px | 16 px |
| Education cells | 16 px | 16 px | 16 px |
| Education headings | 16 px | 18 px | 16 px |
| Contact and supporting text | 16 px | 16 px | 16 px |

The medium hierarchy follows the original templates. Change the role variables and their tests together if a template needs a new hierarchy. Recommended settings and available font choices are listed in the [documentation index](README.md).

Open Sans, EB Garamond, and Varela Round come from the original Google Fonts imports. Arial, Georgia, and Times New Roman use local fonts with fallbacks. Font availability may vary by system; the browser resolves the same stack in the editor and print output.

## Document geometry and printing

The document has a shared width of 210 mm, minimum height of 297 mm, and 10 mm internal padding. It can grow vertically with its content. A `ResizeObserver` adjusts a display-only scale transform to fit the available viewport and keeps the surrounding wrapper's dimensions aligned. There is no size toggle.

Printing uses A4 with zero page margins because padding belongs to the document itself. The print stylesheet hides controls, removes the display transform and paper shadow, and positions the document. It does not change font sizes, text colors, backgrounds, content width, or padding. `print-color-adjust: exact` requests color preservation.

The print button saves pending edits, shows brief export instructions, waits for `document.fonts.ready`, and calls `window.print()`. Browser print settings and page breaks still matter. The screen is a continuous document, not a paginated PDF preview, and text is not automatically shrunk to force one page.

## Profile images

Photo controls appear only if `#previewImage` exists; the institute-logo toggle appears when the header contains another image. Native edits that remove images refresh these controls.

The upload control accepts JPEG, PNG, and WebP files up to 5 MiB. The image is decoded, resized to a maximum dimension of 480 px, drawn on white, and stored as a JPEG data URL at quality `0.85`. It saves inside the draft HTML. A version counter prevents a pending image decode from replacing content after reset or recovery. Canceling the file picker makes no change.

The photo and logo visibility toggles are persisted in the HTML. Large or numerous images can exhaust browser storage; storage errors must remain visible to the user.

## Feedback and external services

The feedback form submits `name`, `email`, `mobile`, `subject`, and `message`. The first three are optional; subject and message are required. Its Google Apps Script deployment identifier is the form's `data-id` in `index.html`.

`main.js` sends a URL-encoded POST using `fetch()`, disables form controls while sending, and uses a 20-second timeout. An HTTP success clears the fields. Failure or inability to confirm delivery retains the message and re-enables the controls. The backend source is not included in this repository; frontend tests should intercept requests rather than submit test messages to it.

CV text is not sent to this feedback endpoint. Google Fonts may make network requests, and pasted remote images load from their source URLs. Optional Claude or ChatGPT browser extensions are separate, user-controlled tools; CV Buddy does not include an AI SDK, API key, or automatic upload to either provider.
