# Testing

The important regressions are native rich-text editing, draft safety, and identical document styling between screen and print. Use this checklist for all three templates, not just the first one.

The repository has no checked-in test runner or CI configuration. Manual browser checks work without installing anything. Browser automation can use an isolated profile and the assertions below. Mock feedback requests; do not submit test messages to the live endpoint.

## Native editing

1. Open a fresh template. Confirm that `#cv` has `contenteditable="true"` and no descendant has its own editing host.
2. Click at the end of an ordinary bullet and press Enter. Confirm that a new sibling list item appears, rather than a newline inside a field.
3. Type into the new bullet, undo, and redo. Check the same operations after autosave has run.
4. Use Shift + Enter inside a bullet. Confirm that it inserts a line break within the item.
5. Select text and use Ctrl/Cmd + B, I, and U. Confirm that the browser applies bold, italic, and underline.
6. Select and copy a complete project block, including its heading and bullet list, then paste it elsewhere in the document. Check the structure and emphasis.
7. Reload after the save indicator confirms success. Check that the new bullet, copied block, and supported formatting remain.
8. Select across sections and verify that the selection is not trapped inside one paragraph or table cell.
9. Remove all document content and reload after saving. A blank draft should stay editable and should not be mistaken for corrupted storage.
10. Confirm that text editing adds no field border, colored background, or focus underline to the resume.

## Typography and help

For each template, check all three size presets and all three offered fonts.

- A fresh draft selects that template's recommended font and size. The recommendation is visible in the controls.
- Small, Medium, and Large change name/title, section headings, education cells/headings, bullets, and contact text together. Document width and padding do not change.
- The styled font picker displays three choices using their fonts. It supports pointer selection, arrows, Home/End, Enter/Space, Escape, Tab, and typing the beginning of a font name.
- Opening the picker and pressing Escape does not change the font. Selecting a font changes the document and the selected state immediately.
- Changing fonts or size does not clear content, turn editing off, or discard bold/italic styling.
- Selected settings survive reload without requiring an additional text edit.
- Editing help opens from Options. Its shortcuts, list instructions, typography explanation, and optional AI-assistance links are readable on desktop and phone widths. Escape and Got it close the dialog.

## Draft persistence and recovery

- Test independent drafts in `iitkgpCvData`, `iitmCvData`, and `iitbCvData`.
- Confirm the saved JSON includes `version: 2`, `html`, and `appearance`.
- Load an older JSON-encoded HTML string. It should retain the original template font and medium sizing, then migrate on the next save.
- Cancel reset and verify that content and typography remain untouched.
- Confirm reset and verify that the current draft is copied to `:beforeReset`, while the sample and recommended settings return.
- Reload, restore the previous draft, and verify both content and typography.
- Simulate a quota/storage exception. Show failure, retain the live content, and refuse reset when the recovery copy cannot be written.
- Load malformed stored JSON. Do not silently overwrite it. Verify that reset preserves the unreadable value as a recovery copy.
- Verify that saving does not mutate the live document or destroy native undo while editing.

Use throwaway browser contexts for these checks. Do not clear a contributor's personal CV to test reset or migration.

## Screen and print fidelity

Run the following checks for every template, size preset, and font option. This is a 27-combination matrix across the three current templates.

1. Wait for `document.fonts.ready` and images to finish loading.
2. Record computed font family, size, weight, style, line height, foreground/background colors, content width, padding, table layout, and heading borders for the CV and its descendants.
3. Switch the browser to print media or open print preview. The recorded document styles must remain the same. Only interface visibility, display fitting, outer positioning, and the decorative paper shadow should differ.
4. Export with A4, browser headers/footers off, and appropriate browser scaling. Check the PDF's text, logo/photo visibility, colors, and page breaks.
5. Check longer content as well as the sample. More than one page is valid; do not compensate by silently changing print typography.
6. Keep Options and help open before invoking browser print to confirm that no interface controls enter the PDF.

The onscreen view is continuous. Matching typography does not imply that the editor displays PDF page boundaries. Browser and operating-system font rendering can also differ; verify the actual export in the browsers you support.

## Photos and controls

- Show/hide the profile photo and the institute logo where present, save, and reload.
- Upload a JPEG, PNG, and WebP. Confirm resizing, persistence, and successful printing.
- Reject an unsupported file or a file larger than 5 MiB with an understandable message.
- Cancel the file picker without changing the CV.
- Start loading a photo, then reset or restore. A late decode must not replace the newly loaded document's image.
- Delete an image through native editing and confirm that its unavailable controls disappear. Undo should restore the image and controls.

## Homepage and feedback

- At 1440 × 900 and 1366 × 768, check that template choices and the feedback form fit without normal page scrolling.
- At 390 px and 320 px widths, check that the homepage stacks naturally, with readable fields and no horizontal overflow.
- Name, email, and mobile are optional. Subject and message are required. Email uses native validation; mobile uses `type="tel"` and `autocomplete="tel"`.
- Intercept a submission and verify the URL-encoded payload includes the entered mobile value.
- Mock success: fields clear, controls re-enable, and success is announced.
- Mock failure or timeout: the message stays in the form and submission becomes available again.
- Keep the form upfront, without an implementation-provider note or a hidden accordion.

## Compact editor and accessibility

Check desktop, tablet, 390 px, and 320 px widths. The CV should start near the top beneath its small toolbar. There should be no sidebar, large editor heading, Edit/Preview toggle, or Actual size/Fit page control.

The page should fit horizontally without document-wide overflow. Verify that the Options menu and font choices stay within the viewport and can scroll vertically when needed. Tab through controls, inspect focus indicators, and ensure statuses are announced without moving the caret.

## Static checks

Run `node --check` on changed JavaScript files when Node is available, and run `git diff --check`. Verify relative HTML and documentation links, image paths, and script/style references. Refresh template thumbnails when default document appearance changes.
