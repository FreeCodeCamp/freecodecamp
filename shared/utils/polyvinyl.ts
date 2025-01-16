// originally based off of https://github.com/gulpjs/vinyl
import invariant from 'invariant';

export type Ext = 'js' | 'html' | 'css' | 'jsx' | 'ts' | 'json';

export type ChallengeFile = {
  fileKey: string;
  ext: Ext;
  name: string;
  editableRegionBoundaries?: number[];
  editableContents?: string;
  usesMultifileEditor?: boolean;
  error?: unknown;
  head: string;
  tail: string;
  seed: string;
  contents: string;
  source?: string | null;
  id: string;
  history: string[];
};

type PolyProps = {
  name: string;
  ext: string;
  contents: string;
  history?: string[];
};

// The types are a little awkward, but should suffice until we move the
// curriculum to TypeScript.
type AddedProperties = {
  path: string;
  fileKey: string;
  error: null;
};

export function createPoly<Rest>({
  name,
  ext,
  contents,
  history,
  ...rest
}: PolyProps & Rest): PolyProps & AddedProperties & Rest {
  invariant(typeof name === 'string', 'name must be a string but got %s', name);

  invariant(typeof ext === 'string', 'ext must be a string, but was %s', ext);

  invariant(
    typeof contents === 'string',
    'contents must be a string but got %s',
    contents
  );

  return {
    ...rest,
    history: Array.isArray(history) ? history : [name + '.' + ext],
    name,
    ext,
    path: name + '.' + ext,
    fileKey: name + ext,
    contents,
    error: null
  } as PolyProps & AddedProperties & Rest;
}

export function isPoly(poly: unknown): poly is ChallengeFile {
  return (
    !!poly &&
    typeof poly === 'object' &&
    'contents' in poly &&
    typeof poly.contents === 'string' &&
    'name' in poly &&
    typeof poly.name === 'string' &&
    'ext' in poly &&
    typeof poly.ext === 'string' &&
    'history' in poly &&
    Array.isArray(poly.history)
  );
}

function checkPoly(poly: ChallengeFile) {
  invariant(
    isPoly(poly),
    'function should receive a PolyVinyl, but got %s',
    poly
  );
}

// setContent will lose source if set
export function setContent(
  contents: string,
  poly: ChallengeFile
): ChallengeFile {
  checkPoly(poly);
  return {
    ...poly,
    contents,
    source: null
  };
}

// This is currently only used to add back properties that are not stored in the
// database.
export function regeneratePathAndHistory(poly: ChallengeFile) {
  const newPath = poly.name + '.' + poly.ext;
  const newPoly = {
    ...poly,
    path: newPath,
    history: [newPath]
  };
  checkPoly(newPoly);
  return newPoly;
}

async function clearHeadTail(polyP: Promise<ChallengeFile>) {
  const poly = await polyP;
  checkPoly(poly);
  return {
    ...poly,
    head: '',
    tail: ''
  };
}

export async function compileHeadTail(padding = '', poly: ChallengeFile) {
  return clearHeadTail(
    transformContents(
      () => [poly.head, poly.contents, poly.tail].join(padding),
      poly
    )
  );
}

type Wrapper = (x: string) => Promise<string> | string;
// transformContents will keep a copy of the original
// code in the `source` property. If the original polyvinyl
// already contains a source, this version will continue as
// the source property
export async function transformContents(
  wrap: Wrapper,
  polyP: ChallengeFile | Promise<ChallengeFile>
) {
  const poly = await polyP;
  const newPoly = setContent(await wrap(poly.contents), poly);
  // if no source exist, set the original contents as source
  newPoly.source = poly.source || poly.contents;
  return newPoly;
}

export async function transformHeadTailAndContents(
  wrap: Wrapper,
  polyP: ChallengeFile | Promise<ChallengeFile>
) {
  const poly = await polyP;
  const contents = await transformContents(wrap, poly);
  const head = await wrap(poly.head);
  const tail = await wrap(poly.tail);
  return {
    ...contents,
    head,
    tail
  };
}

// createSource(poly: PolyVinyl) => PolyVinyl
export function createSource(poly: Pick<ChallengeFile, 'contents' | 'source'>) {
  return {
    ...poly,
    source: poly.source || poly.contents
  };
}
