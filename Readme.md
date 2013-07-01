
# fancy-doc

  Document component based projects using markdown.  `fancy-doc` uses a given
  root directory and serves the documentation of all contained projects.  It
  assumes that the project has a `component.json` file within its top-level
  directory which is used to determine the submodules.  See
  [project-view](lib/project-view) for the ReST-style api.

## Usage

  `fancy-doc` operates on a directory which contains multiple *component-based*
  projects.  A project with components has the following structure:

    project-name/
      component.json
      ...

  The `component.json` should at least include the name of the project.
  `fancy-doc` then reads the `paths` key from the `component.json` (see
  [component.json (spec)](https://github.com/component/component/wiki/Spec)) to
  get where the modules of the project reside.  Each of these modules can
  include a `Readme.md` file which is linked by `fancy-doc`.

  So now you should have a structure like the following:

    root/
      project-name/
        component.json
        ...

  Now start `fancy-doc`

    $ bin/fancy-doc --root path/to/root

  and point your favorite internet browser to
  `http://localhost:3000/projects/project-name/` to browse your documentation.

  Happy hacking!

## License 

(The MIT License)

Copyright (c) 2013 Dominik Burgdörfer &lt;dominik.burgdoerfer@mikanda.de&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
