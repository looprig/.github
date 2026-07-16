# The journal

Posts in this folder appear on looprig.com as the journal. The journal is an
append-only record: entries are numbered in publication order, so add new
posts with a current date and avoid backdating or reordering old ones.

## Adding a post

Create one Markdown file per post. The filename is a kebab-case slug and
becomes the URL, so `hello-rig.md` is published at `/blog/hello-rig`.

Every post starts with a frontmatter block:

- `title` (string, required): the post title.
- `description` (string, required): a one-sentence summary shown in listings.
- `pubDate` (date, required): publication date as `YYYY-MM-DD`.
- `draft` (boolean, optional, default `false`): set `true` to keep a post off
  the published site.

Start the body directly after the frontmatter, without repeating the title as
a heading. Write in clear, concise, human language. Use `we` when speaking for
the project. Do not use em dashes or emojis. See `hello-rig.md` for a template.
