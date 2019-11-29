<h1 align="center">
  <span>UIGuide</span>
</h1>

<p align="center">
  <strong>A programmatic way for making highlight guide :high_brightness:</strong>
</p>

<p align="center">
  <a href="https://github.com/ranndev/ui-guide/actions?query=workflow%3Abuild">
    <img src="https://github.com/ranndev/ui-guide/workflows/build/badge.svg?branch=develop" alt="Build Status">
  </a>
  <a href="https://greenkeeper.io">
    <img src="https://badges.greenkeeper.io/ranndev/ui-guide.svg" alt="Greenkeeper Status">
  </a>
  <a href="https://codecov.io/gh/ranndev/ui-guide">
    <img src="https://codecov.io/gh/ranndev/ui-guide/branch/develop/graph/badge.svg" alt="codecov - Code Coverage">
  </a>
  <a href="https://snyk.io/test/github/ranndev/ui-guide">
    <img src="https://img.shields.io/snyk/vulnerabilities/github/ranndev/ui-guide" alt="Synk - Vulnerabilities">
  </a>
  <a href="https://www.codefactor.io/repository/github/ranndev/ui-guide">
    <img src="https://img.shields.io/codefactor/grade/github/ranndev/ui-guide/develop" alt="CodeFactor - Grade">
  </a>
</p>

<div align="center">
  <img src="./logo.svg" align="center" width="250">
</div>

### Installation

| Source | Command                                |
| :----- | :------------------------------------- |
| npm    | `npm install @ranndev/ui-guide --save` |
| yarn   | `yarn add @ranndev/ui-guide`           |

_Note: [Popper.js](https://github.com/FezVrasta/popper.js) is a peer dependency of this package, so you should [install it](https://github.com/FezVrasta/popper.js#installation) too._

### Setup

#### Styles

There are 2 required styles that must be included into your app.

1. Base style - Includes the base styles for UIGuide elements. This is located from `/dist/css/ui-guide(.min).css` or `/dist/scss/ui-guide.scss` if you're using [Scss](https://sass-lang.com/).
2. Theme style - Includes the styles that gives color and animation to UIGuide element. This is located from `/dist/css/themes/*` or `/dist/scss/themes/*` if you're using [Scss](https://sass-lang.com/).

#### Scripts

If you're going to import the package using `<script>` tag, use UMD (Universal Module Definition).

### Usage

#### Highlight element

Basic highlighting.

```javascript
UIGuide.highlight('#target-element');

// or

const target = document.querySelector('#target-element');
UIGuide.highlight(target);
```

Highlight after highlight.

```javascript
UIGuide.highlight('#get-started-button').then((highlighted) => {
  highlighted.element.onclick = () => {
    UIGuide.highlight('#second-step-button').then(() => {
      // ...
    });
  };
});
```

Using `async ... await`

```javascript
async function startDemo() {
  const highligted1 = await UIGuide.highlight('#get-started-button');
  highlighted1.element.onclick = async () => {
    const highligted2 = await UIGuide.highlight('#second-step-button');
    // ...
  };
}
```

Highlight with popup

```javascript
UIGuide.highlight({
  element: '#target-element',
  events: {
    onElementsReady: (elements) => {
      if (elements.popup) {
        // Do whatever you want to popup element
        elements.popup.innerHTML = '<p>Click Me!</p>';
      }
    },
  },
});
```

#### Unhighlight

```javascript
UIGuide.highlight('#target-element', (highlighted) => {
  highlighted.unhighlight();
});

// or

UIGuide.clear();
```

#### Configure

Configuring the global settings.

_Note: All the configuration properties in the code snippet below are optional._

```javascript
UIGuide.configure({
  // Option on wether the target element should be clickable. true by default.
  clickable: true,
  // Automatically set the focus on the target element. Enabled by default.
  autofocus: true,
  // If `false`, It will throw an error immediately once searching for the
  // target element fail on the first try.
  wait: {
    // A delay (in milliseconds) before it will try to search for the target
    // element again. Default value is 150.
    delay: 150,
    // A maximum wait time before it give up on searching for the target element.
    // An error will be thrown when the set 'max' reached. Default value is Infinity
    max: Infinity,
  },
  // If true, a popup will show using the default popper.js options. It can
  // also be a popper options, which will use to override the
  // default popper options (https://popper.js.org/popper-documentation.html#Popper.Defaults).
  popper: true,
  // When this is set to 'highlight-box', the highlight's element
  // ('[uig-highlight-box]') will be used as the popper reference element.
  // It will be the highlighted element otherwise.
  popperRef: 'highlight-target',
  // Options for listening on events.
  events: {
    // This event will fire once the target element successfully queried.
    onTargetFound: (target) => {},
    // This will fire when the target, highlight, and popup (if available)
    // elements are ready.
    onElementsReady: (elements) => {},
    // This will fire everytime the highlight's element request an update.
    // Important! Listening on this event will bring you the full
    // responsibility of updating the highlight & popup elements. Make sure to
    // implement this function as performant as possible.
    onHighlightUpdate: (elements) => {},
  },
  // Overrides the update delay for the highlight element.
  // By default, the position and size of highlight element were updated every
  // 0 miliseconds.
  highlightUpdateDelay: 0,
});
```

### Credits

[Popper.js](https://github.com/FezVrasta/popper.js) - For making our UIGuide's popup so incredible :tada:

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
