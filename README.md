<h1 align="center">
  <span>UIGuide</span>
</h1>

<p align="center">
  <strong>Let's help your end users quickly get started from your web applications :ok_woman::ok_man:</strong>
</p>

<p align="center">
  <a href="https://github.com/rannie-peralta/ui-guide/actions?query=workflow%3Abuild">
    <img src="https://github.com/rannie-peralta/ui-guide/workflows/build/badge.svg?branch=develop" alt="Build Status">
  </a>
  <a href="https://greenkeeper.io">
    <img src="https://badges.greenkeeper.io/rannie-peralta/ui-guide.svg" alt="Greenkeeper Status">
  </a>
  <a href="https://codecov.io/gh/rannie-peralta/ui-guide">
    <img src="https://codecov.io/gh/rannie-peralta/ui-guide/branch/develop/graph/badge.svg" alt="codecov - Code Coverage">
  </a>
  <a href="https://snyk.io/test/github/rannie-peralta/ui-guide">
    <img src="https://img.shields.io/snyk/vulnerabilities/github/rannie-peralta/ui-guide" alt="Synk - Vulnerabilities">
  </a>
  <a href="https://www.codefactor.io/repository/github/rannie-peralta/ui-guide">
    <img src="https://img.shields.io/codefactor/grade/github/rannie-peralta/ui-guide/develop" alt="CodeFactor - Grade">
  </a>
</p>

<div align="center">
  <img src="./logo.svg" align="center" width="250">
</div>

### Installation

| Source | Command                                       |
| :----- | :-------------------------------------------- |
| npm    | `npm install @rannie-peralta/ui-guide --save` |
| yarn   | `yarn add @rannie-peralta/ui-guide`           |

_Note: [Popper.js](https://github.com/FezVrasta/popper.js) is a peer dependency of this package, so you should [install it](https://github.com/FezVrasta/popper.js#installation) too._

### Setup

#### Styles

There are 2 required styles that must be included into your app.

1. Base style - Includes the base styles for UIGuide elements. This is located from `/dist/css/ui-guide(.min).css` or `/dist/scss/ui-guide.scss` if you're using [Scss](https://sass-lang.com/).
2. Theme style - Includes the styles that gives color and animation to UIGuide element. This is located from `/dist/css/themes/*` or `/dist/scss/themes/*` if you're using [Scss](https://sass-lang.com/).

#### Scripts

If you're going to import the package using `<script>` tag, use UMD (Universal Module Definition).

### Usage

#### Highlighting element

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
      ...
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
    ...
  };
}
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

```javascript
```

### Credits

[Popper.js](https://github.com/FezVrasta/popper.js) - For making our UIGuide's popup so incredible and responsive :tada:

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
