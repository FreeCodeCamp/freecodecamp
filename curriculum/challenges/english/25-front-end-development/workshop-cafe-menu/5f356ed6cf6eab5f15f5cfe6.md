---
id: 5f356ed6cf6eab5f15f5cfe6
title: Step 20
challengeType: 0
dashedName: step-20
---

# --description--

The `div` element is used mainly for design layout purposes, unlike the other content elements you have used so far. Add a `div` element inside the `body` element and then move all the other elements inside the new `div`.

Inside the opening `div` tag, add the `id` attribute with a value of `menu`.

# --hints--

Your opening `<div>` tag should have an `id` attribute set to `menu`.

```js
assert.strictEqual(document.querySelector('div')?.id, 'menu');
```

You should have a closing `</div>` tag.

```js
assert(code.match(/<\/div>/i));
```

You should not change your existing `body` element. Make sure you did not delete the closing tag.

```js
assert.lengthOf(document.querySelectorAll('body'), 1);
```

Your `div` tag should be nested in the `body`.

```js
assert.equal(document.querySelector('div')?.parentElement?.tagName, 'BODY');
```

You should move all the other elements inside the new `div`.

```js
assert.lengthOf(document.querySelector('body > div#menu > main')?.children, 3);
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cafe Menu</title>
    <link href="styles.css" rel="stylesheet"/>
  </head>
--fcc-editable-region--
  <body>
    <main>
      <h1>CAMPER CAFE</h1>
      <p>Est. 2020</p>
      <section>
        <h2>Coffee</h2>
      </section>
    </main>
  </body>
--fcc-editable-region--
</html>
```

```css
body {
  background-color: burlywood;
}

h1, h2, p {
  text-align: center;
}
```

