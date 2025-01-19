---
id: 66a97ca8c4cbae7d0bb6e0ad
title: Step 31
challengeType: 0
dashedName: step-31
---

# --description--

Inside your `select` element, add the following five `option` elements with these corresponding values for the `option` text and `value` attribute:

**Value Attribute:**

- poor
- satisfactory
- good
- very-good
- excellent

**Option Text:**

- Poor
- Satisfactory
- Good
- Very Good
- Excellent


Don't forget to add the `selected` attribute to the `option` element with the value of `"excellent"`.

# --hints--

You should have an `option` element with the value set to `"poor"`.

```js
assert(document.querySelector('fieldset:nth-of-type(4) select#food option[value="poor"]'));
```

Your `option` with the `value` of `"poor"` should have the text `"Poor"`.

```js
assert.strictEqual(document.querySelector('fieldset:nth-of-type(4) select#food option[value="poor"]')?.textContent, 'Poor');
```

You should have an `option` element with the `value` set to `"satisfactory"`.

```js
assert(document.querySelector('fieldset:nth-of-type(4) select#food option[value="satisfactory"]'));
```

Your `option` with the `value` of `"satisfactory"` should have the text `"Satisfactory"`.

```js
assert.strictEqual(document.querySelector('fieldset:nth-of-type(4) select#food option[value="satisfactory"]')?.textContent, 'Satisfactory');
```

You should have an `option` element with the `value` set to `"good"`.

```js
assert(document.querySelector('fieldset:nth-of-type(4) select#food option[value="good"]'));
```

Your `option` with the `value` of `"good"` should have the text `"Good"`.

```js

assert.strictEqual(document.querySelector('fieldset:nth-of-type(4) select#food option[value="good"]')?.textContent, 'Good');
```

You should have an `option` element with the value set to `"very-good"`.

```js
assert(document.querySelector('fieldset:nth-of-type(4) select#food option[value="very-good"]'));
```

Your `option` with the `value` of `"very-good"` should have the text `"Very Good"`.

```js
assert.strictEqual(document.querySelector('fieldset:nth-of-type(4) select#food option[value="very-good"]')?.textContent, 'Very Good');
```

You should have an `option` element with the value set to `"excellent"`.

```js
assert(document.querySelector('fieldset:nth-of-type(4) select#food option[value="excellent"]'));
```

Your `option` with the `value` of `"excellent"` should have the text `"Excellent"`.

```js

assert.strictEqual(document.querySelector('fieldset:nth-of-type(4) select#food option[value="excellent"]')?.textContent, 'Excellent');
```

You should have an `option` element with the `selected` attribute set to `"excellent"`.

```js
assert(document.querySelector('fieldset:nth-of-type(4) select#food option[value="excellent"][selected]'));
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Hotel Feedback Form</title>
  </head>
  <body>
    <header>
      <h1>Hotel Feedback Form</h1>
      <p>
        Thank you for staying with us. Please provide feedback on your recent
        stay.
      </p>
    </header>
    <main>
      <form method="POST" action="https://hotel-feedback.freecodecamp.org">
        <fieldset>
          <legend>Personal Information</legend>
          <label for="full-name">Name (required):</label>
          <input type="text" id="full-name" name="name" placeholder="Ex. John Doe" required>

          <label for="email">Email address (required):</label>
          <input
            placeholder="example@email.com"
            required
            id="email"
            type="email"
            name="email"
          />
          <label for="age">Age (optional):</label>
          <input type="number" name="age" id="age" min="3" max="100" />
        </fieldset>

        <fieldset>
          <legend>Was this your first time at our hotel?</legend>
          <label for="yes-option">Yes</label>
          <input id="yes-option" type="radio" name="hotel-stay" />
          <label for="no-option">No</label>
          <input id="no-option" type="radio" name="hotel-stay" />
        </fieldset>

        <fieldset>
          <legend>
            Why did you choose to stay at our hotel? (Check all that apply)
          </legend>

          <label for="ads">Social Media Ads</label>
          <input type="checkbox" id="ads" name="ads" value="ads" />

          <label for="recommendation">Personal Recommendation</label>
          <input
            type="checkbox"
            id="recommendation"
            name="recommendation"
            value="recommendation"
          />

          <label for="location">Location</label>
          <input type="checkbox" id="location" name="location" value="location" />

          <label for="reputation">Reputation</label>
          <input
            checked
            type="checkbox"
            id="reputation"
            name="reputation"
            value="reputation"
          />

          <label for="price">Price</label>
          <input type="checkbox" id="price" name="price" value="price" />
        </fieldset>

        <fieldset>
          <legend>Ratings</legend>

          <label for="service">How was the service?</label>

          <select name="service" id="service">
            <option value="poor">Poor</option>
            <option value="satisfactory">Satisfactory</option>
            <option value="good">Good</option>
            <option value="very-good">Very Good</option>
            <option selected value="excellent">Excellent</option>
          </select>

          <label for="food">How was the food?</label>

          --fcc-editable-region--
          <select name="food" id="food">
            
          </select>
          --fcc-editable-region--
        </fieldset>
      </form>
    </main>
  </body>
</html>
```
