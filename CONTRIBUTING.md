# Contributing to UIGuide

Thanks for your interest in UIGuide! You are very welcome to contribute.

## Report bugs

If you find a bug, please, try to isolate the specific case and provide a fiddle on CodePen or JSFiddle to make it easy to reproduce the problem and help others finding a solution.

You can use [this CodePen](https://codepen.io/ranndev/pen/LYEPgmL) which already includes ui-guide & popper.js.

Feature requests are welcome!

## Setup

Run `npm` to install the needed dependencies.

### Adopt an issue

All the issues, if not assigned to someone, can be adopted by anyone. Just make sure to comment on
the issue to let know other users about your intention to work on it.
Also, remember to comment again in case you end up abandoning the issue.

### Style conventions

You don't have to worry about code style conventions, [prettier](https://github.com/prettier/prettier)
will automatically format your code once you commit your changes.

### Testing & Developing

We strive to keep the code coverage as high as possible, but above all, we want to avoid
to introduce or reintroduce bugs in our code base.

For this reason, every time a code change is made, we must make sure that a test is covering
the code we just changed.
If we fix a bug, we add a test to avoid that this bug pops up again in the future.

To help us with this process, we have a cypress environment to test & develop UIGuide.

The tests are located in the `cypress/integration`.

To run the cypress tests:

```bash
# Happy developing!
npm run test:dev
```

### Build

To build the package (js, type declaration, style, and themes) for production release, run:

```bash
npm run build
```
