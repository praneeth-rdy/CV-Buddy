# Product and UX decisions

CV Buddy is an open-source utility, not a commercial landing page. Keep the interface modern, restrained, and useful, with straightforward language. The decisions below describe the intended experience for future contributions.

## Homepage

- Keep the homepage short. At typical desktop sizes, the template choices and feedback form should fit on one screen. Stack them naturally on smaller screens rather than making controls too small to use.
- Keep the feedback form visible immediately. Do not hide it behind an accordion, modal, or marketing sections.
- Preserve optional name, email, and mobile fields, plus required subject and message fields.
- Use plain descriptions of what users can do. Avoid promotional sections, sales language, and invented product claims.
- Show the actual CV layouts in template thumbnails. Refresh the images when template content or recommended typography changes.
- Keep the site identity as a simple text link. The decorative “b.” logo was deliberately removed.
- Do not put implementation details such as the feedback transport provider in the form. Document those details for contributors instead.

## Direct editing is the core feature

The resume on screen is the editable output. Keep one `contenteditable="true"` host on `#cv`, as in the original editor. Do not turn paragraphs, cells, or bullets into independent input fields or `plaintext-only` editing regions.

Native browser behavior must remain available:

- Enter continues a bullet list; Enter on an empty bullet exits the list.
- Shift + Enter inserts a line break within an item.
- Users can select across elements, copy whole blocks, and paste formatted content.
- Bold, italic, underline, undo, redo, cut, copy, and paste work through the browser's editing commands.
- Saving must not replace the live document, reset the caret, or destroy native undo history.

Do not intercept these commands to simulate them with custom text-field behavior. The editor intercepts Ctrl/Cmd + S to save the draft, while leaving the other editing shortcuts native.

## Keep the document prominent

Keep a compact toolbar above the CV. The document should begin near the top of the screen rather than below a large title, information banner, sidebar, or multiple control rows.

There is one editing view. Do not add Edit/Preview modes, a separate preview screen, or an Actual size/Fit page toggle. The document automatically fits the available display width. Browser print preview remains the final place to inspect page breaks.

Put secondary controls in Options: typography, photos, saving, reset recovery, and editing help. Avoid adding large persistent panels. The initial sample notice is a short line, not a banner. Operational notices can be dismissed; save failures remain visible until dismissed or handled.

Do not style editable text as input boxes. The resume should not acquire field borders, background highlights, or underlines just because the caret is inside it. Form fields on the homepage use a subtle border on focus. Keep a visible but restrained keyboard-focus indicator on buttons and links.

## Match screen and print

Preserve the selected template's colors and document styling when printing. The document width, padding, typography, and table layout are shared between screen and print.

Print rules hide interface controls, remove the screen-only fitting transform and paper shadow, and position the document for printing. They must not introduce smaller fonts, different colors, different content widths, or a separate print theme.

A longer CV may occupy multiple pages. Do not silently shrink text to force one page. Browser print settings, selected paper size, and pagination still affect the exported PDF; ask users to choose A4 and disable browser headers and footers.

## Typography is a document style

Small, Medium, and Large are coordinated typography variants, not zoom levels or individual point-size controls. A preset covers the main name/title, section titles, institute subtitle, education table, bullets, and supporting text together.

Each template owns three font options and a recommended font/size pair. New drafts start with those recommendations. Saved choices survive reloads. Existing HTML-only drafts use their original template font and medium sizing when first loaded.

The font picker should look consistent with the rest of the interface and support mouse, keyboard, and assistive technology. Show the font names in their own fonts, clearly label the recommended choice, and preserve keyboard navigation when changing its implementation.

Document-level font and size presets govern the CV's overall typography, including pasted content. Rich-text structure, emphasis, links, and supported colors remain available. Apply the same variants to print.

## Help and optional AI assistance

Provide Editing help under Options, including keyboard shortcuts, list behavior, block copy/paste, typography, and saving. Keep this help out of the main document area.

Users may use Claude or ChatGPT browser extensions to help draft or fill content from their own details. The help links to the providers' official instructions and reminds users to review the result. This is guidance for an optional external tool, not an AI integration inside CV Buddy. Do not add API keys, automatic CV uploads, or a paid AI workflow as part of this tip.

## Sample content and draft safety

Use plausible fictional profiles with consistent education, employment, project dates, and institute names. Use example email addresses and clearly identify sample content outside the printable CV. Updating samples must not overwrite an existing draft.

Communicate whether a draft is saved in this browser. Reset requires confirmation and must preserve a recovery copy first. Storage failures must not be presented as successful saves. A recovery operation restores typography along with content.
