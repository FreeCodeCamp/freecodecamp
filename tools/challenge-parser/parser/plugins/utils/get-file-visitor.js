const { isEmpty } = require('lodash');
const is = require('unist-util-is');
const position = require('unist-util-position');

const getId = require('./get-id');

const keyToSection = {
  head: 'before-user-code',
  tail: 'after-user-code'
};
const supportedLanguages = ['js', 'css', 'html', 'jsx', 'py', 'ts', 'json'];
const longToShortLanguages = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py'
};

function defaultFile(lang, id) {
  return {
    ext: lang,
    name: getFilenames(lang),
    contents: '',
    head: '',
    tail: '',
    id
  };
}

function getFilenames(lang) {
  const langToFilename = {
    js: 'script',
    css: 'styles',
    py: 'main'
  };
  return langToFilename[lang] ?? 'index';
}

function getFileVisitor(seeds, seedKey, validate) {
  return (node, index, parent) => {
    if (is(node, 'root')) return;
    if (is(node, 'code')) {
      codeToData(node, seeds, seedKey, validate);
      return;
    }
    idToData(node, index, parent, seeds);
  };
}

function codeToData(node, seeds, seedKey, validate) {
  if (validate) validate(node);
  const lang = node.lang;
  const shortLang = longToShortLanguages[lang] ?? lang;
  if (!supportedLanguages.includes(shortLang))
    throw Error(`On line ${
      position.start(node).line
    } '${shortLang}' is not a supported language.
 Please use one of js, css, html, jsx or py
`);

  const fileId = `index${shortLang}`;
  const id = seeds[fileId] ? seeds[fileId].id : '';
  // the contents will be missing if there is an id preceding this code
  // block.
  if (!seeds[fileId]) {
    seeds[fileId] = defaultFile(shortLang, id);
  }
  if (isEmpty(node.value) && seedKey !== 'contents') {
    const section = keyToSection[seedKey];
    throw Error(`Empty code block in --${section}-- section`);
  }

  seeds[fileId][seedKey] = isEmpty(seeds[fileId][seedKey])
    ? node.value
    : seeds[fileId][seedKey] + '\n' + node.value;
}

function idToData(node, index, parent, seeds) {
  const id = getId(node);

  // If this is reached, the node type is neither root nor code. If it is not
  // an id, there must be a syntax error.
  if (!id) {
    throw Error(
      'Unexpected syntax in seed/solution. Must be ::id{#id} or a code ' +
        'block (```) \n'
    );
  }
  const codeNode = parent.children[index + 1];
  if (codeNode && is(codeNode, 'code')) {
    const shortLang = longToShortLanguages[codeNode.lang] ?? codeNode.lang;
    const fileKey = `index${shortLang}`;
    if (seeds[fileKey]) throw Error('::id{#id}s must come before code blocks');
    seeds[fileKey] = defaultFile(shortLang, id);
  } else {
    throw Error('::id{#id}s must come before code blocks');
  }
}

module.exports.getFileVisitor = getFileVisitor;
