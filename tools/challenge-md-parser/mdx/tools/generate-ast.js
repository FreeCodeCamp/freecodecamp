const { read } = require('to-vfile');
const remark = require('remark');
const directive = require('remark-directive');
const frontmatter = require('remark-frontmatter');

(async () => {
  const path = './example.mdx';
  const file = await read(path);
  await remark()
    .use(directive)
    .use(frontmatter, ['yaml'])
    .use(() => tree => console.log(JSON.stringify(tree)))
    .process(file);
})();
