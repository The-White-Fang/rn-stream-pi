# Contributing to React Native Stream-Pi

We love your input! We want to make contributing to React Native Stream-Pi as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html)

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Process

1. Clone the repository:
   ```bash
   git clone https://github.com/stream-pi/rn-stream-pi.git
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Run TypeScript checks:
   ```bash
   yarn typecheck
   ```

4. Run linting:
   ```bash
   yarn lint
   ```

5. Test your changes:
   ```bash
   yarn test
   ```

## Local Development

1. Create a new React Native project
2. Link the package locally:
   ```bash
   yarn link
   cd /path/to/your/project
   yarn link rn-stream-pi
   ```

## Any contributions you make will be under the GPL-3.0 Software License

In short, when you submit code changes, your submissions are understood to be under the same [GPL-3.0 License](http://choosealicense.com/licenses/gpl-3.0/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issue tracker](https://github.com/stream-pi/rn-stream-pi/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/stream-pi/rn-stream-pi/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License

By contributing, you agree that your contributions will be licensed under its GPL-3.0 License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md). 