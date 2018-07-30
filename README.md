
# Lucky React

Lucky is awesome, react is too. This package makes it easy to define and render react components in your Lucky applications.

# Installation

Make sure you have `react` and `react-dom` installed in your project.

Then install `lucky-react` with npm.

```
npm install lucky-react
```

or yarn

```
yarn add lucky-react
```

## Usage

First make sure Laravel mix is [configured to handle react](https://laravel.com/docs/5.6/mix#react).

```javascript
// webpack.mix.js
mix
  .react("src/js/app.js", "public/js") // instead of .js(...)
```

Then in your app's main JavaScript file, which is `src/js/app.js` by default, import `LuckyReact` and your React components, and register them with `LuckyReact.register({ Component })`.

```javascript
// src/js/app.js
...
import LuckyReact from "lucky-react";
import { Component } from './components';

LuckyReact.register({ Component });
```

This syntax uses [JavaScript's destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) and is equivalent to:

```javascript
LuckyReact.register({ 'Component': Component });
```

Then in your Lucky Page you can render your component by setting the `data-react-class` and `daata-react-props` attributes on an element.

```crystal
class Home::IndexPage < GuestLayout
  def content
    h1 "React Component"
    div "data-react-class": "Component",
        "data-react-props": { message: "Message" }.to_json do
      text "wrapped content"
    end
  end
end
```

If you have the [lucky_react](https://github.com/mikeeus/lucky_react) shard installed you can do this instead.

```crystal
class Home::IndexPage < GuestLayout
  def content
    h1 "React Component"

    react "Component", { message: "Message" } do
      text "wrapped content"
    end
  end
end
```

## Contributors

[Mikias Abera](https://github.com/mikeeus)

## License

MIT
