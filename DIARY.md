<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Project analysis](#project-analysis)
- [Code in-depth](#code-in-depth)
- [Refactoring](#refactoring)
- [New functionalities](#new-functionalities)

<!-- /code_chunk_output -->

# Project analysis

- Use of `yarn`, instead of `npm` for no obvious reason leading to unecessary and concerning file diffs: `.yarnrc.yml`, `package-lock.json`, `yarn.lock`.
  So much for "Safe, stable, reproducible projects".
  → Could use `npm` and `nvm` with:
  `sh
    $ echo "save-exact=true\nfund=false\ncolor=always" >> .npmrc
    $ echo '23' > .nvmrc
    `
  to ensure minimaly homogeneous project environment amongst devs.
- No subfolders to organize the project, "free range" code-bearing files wanders freely amongst the input and output files, configurations, documentation and other project-related "stuff".

# Code in-depth

# Refactoring

# New functionalities
