Workflow
========

Before committing changes, run grunt (which runs tests and linting)::

    grunt

If grunt doesn’t succeed, the `continuous integration tests`_ will fail
as well.

To only run the tests, do::

    npm test

To only run the linter::

    grunt gjslint

For more semantic linting, try::

    grunt hint

If gjslint complains about style errors (like indentation), you can fix
many of them automatically using::

    grunt fixjsstyle

To compile webppl for use in browser, run::

    npm install -g browserify
    browserify -t brfs src/browser.js > compiled/webppl.js

Packages can also be used in the browser. For example, to include the
``webppl-viz`` package use::

    browserify -t [./src/bundle.js --require webppl-viz] -t brfs src/browser.js > compiled/webppl.js

Multiple ``--require`` arguments can be used to include multiple
packages.

.. _continuous integration tests: https://travis-ci.org/probmods/webppl
