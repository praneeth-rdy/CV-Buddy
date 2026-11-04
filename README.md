# CV Buddy

A free, open-source CV editor built with HTML, CSS, and JavaScript. Edit the final document directly in your browser, then save it as a PDF. No account or installation is required to use the website.

[Open CV Buddy](https://praneeth-rdy.github.io/CV-Buddy/) · [Documentation](docs/README.md) · [Report an issue](https://github.com/praneeth-rdy/CV-Buddy/issues)

## Using the editor

1. Choose a template. Each starts with a fictional sample profile; replace it with your own details.
2. Click directly on the CV to edit. Enter continues a bullet list, formatted blocks can be copied and pasted, and native formatting and undo shortcuts work throughout the document.
3. Open **Options** to change the font or choose a **Small**, **Medium**, or **Large** text style. Each style adjusts titles, headings, tables, and body text together. Photo and institute-logo controls appear where supported.
4. Check the toolbar's save status. Content and typography settings save automatically in this browser.
5. Select **Print / Save PDF**, choose A4, and turn off browser headers and footers. Check the page breaks before exporting; longer CVs can span multiple pages.

The CV stays editable at all times. It automatically fits the available screen width, and its document typography, colors, width, and padding are shared with print output.

**Options → Editing help & shortcuts** explains bold, italic, underline, undo/redo, list editing, and block copy/paste. It also includes optional guidance for using a browser assistant to help draft content. CV Buddy does not require an AI service.

## Templates

Each template offers three font choices and its own recommended defaults for a new draft. Existing drafts retain their saved settings.

| Template | Inspired by | Recommended size | Recommended font |
| --- | --- | --- | --- |
| [Classic](iitkgp/index.html) | IIT Kharagpur | Small | Open Sans |
| [Contemporary](iitm/index.html) | IIT Madras | Medium | Arial |
| [Editorial](iitb/index.html) | IIT Bombay | Medium | EB Garamond |

Anyone can use these templates. They are not official institute documents. See the [documentation index](docs/README.md#current-template-defaults) for all font choices.

## Saving and recovery

There is one browser-local draft per template, with no cloud synchronization. Use the same browser profile and URL to return to it. Local files, localhost, and the hosted website may have separate storage. Clearing browser data can remove drafts, so export a PDF before clearing storage or moving devices.

- **Options → Save now** or **Ctrl/Cmd + S** inside the CV saves immediately.
- **Options → Reset to sample** asks for confirmation, keeps a recovery copy, and restores the sample with its recommended typography.
- **Options → Restore before last reset** recovers the previous content and typography. Only the most recent reset has a recovery copy.

If browser storage is unavailable or full, the editor shows a save failure. Keep the page open and export your work before troubleshooting. Updating a template's sample content does not replace an existing saved draft.

## Running locally

Clone or download the repository, then open [index.html](index.html) in your browser. There is no build step or package installation.

```sh
git clone https://github.com/praneeth-rdy/CV-Buddy.git
cd CV-Buddy
```

If you prefer a local HTTP server, run this from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit [localhost](http://127.0.0.1:8000/) and stop the server with Ctrl + C when finished. A server is optional.

Loading Google Fonts and sending feedback require an internet connection. Editing can work offline with fallback fonts. The feedback backend is external to this repository; see [Architecture](docs/ARCHITECTURE.md#feedback-and-external-services) for details.

## Developer documentation

Start with [docs/README.md](docs/README.md). Before changing the editor, read the decisions and regression checks that preserve its native editing behavior and print fidelity.

- [Product and UX decisions](docs/UX_DECISIONS.md)
- [Architecture and saved-draft format](docs/ARCHITECTURE.md)
- [Local development and adding templates](docs/DEVELOPMENT.md)
- [Testing checklist](docs/TESTING.md)
- [Contribution guidelines](docs/CONTRIBUTING.md)

## Contributing and feedback

Use the feedback form on the homepage or [open an issue](https://github.com/praneeth-rdy/CV-Buddy/issues). Name, email, and mobile are optional in the form. Bug reports, suggestions, documentation improvements, and code contributions are welcome.

For code changes, follow the [contribution guidelines](docs/CONTRIBUTING.md) and [pull request template](pull_request_template.md). Include what changed and how you checked it. Test feedback submissions with mocked requests rather than sending test messages to the live form endpoint.

Maintained by [Praneeth Reddy Kolanu](https://github.com/praneeth-rdy).

## License

Distributed under the GNU GPL v3.0 license. See [LICENSE.md](LICENSE.md).

## Acknowledgements

The original README was based on [Best-README-Template](https://github.com/othneildrew/Best-README-Template). The project uses [GitHub Pages](https://pages.github.com/) for its public site and [Google Fonts](https://fonts.google.com/) for the original template fonts.
