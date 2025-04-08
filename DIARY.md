# Project analysis

- Use of `yarn`, instead of `npm` for no obvious reason leading to unecessary and concerning file diffs: `.yarnrc.yml`, `package-lock.json`, `yarn.lock`.
  So much for "Safe, stable, reproducible projects".
  → Could use `npm` and `nvm` with:

  ```sh
  $ echo "save-exact=true\nfund=false\ncolor=always" >> .npmrc
  $ echo '23' > .nvmrc
  ```

  to ensure minimaly homogeneous project environment amongst devs.

- No subfolders to organize the project, "free range" code-bearing files wanders freely amongst the input and output files, configurations, documentation and other project-related "stuff".

# In-depth analysis

## Test

Only one case, using static data, and doing multiple actions, it's inappropriate and insufficient to ensure functionalities parity between refactoring.

> [!NOTE]
> Possible refactoring:
>
> - 1 case per business rule
> - Randomised data conform to the case tested

---

## Code base

### `Drug` class

No-logic class, having no distinction between its immutable attributes and its instance data.

### `Pharmacy` class

God-tier class that embed all the business logic under a single method `updateBenefitValue`.
Sequencially process its `drugs` array attribute.
`if-else` house of cards defining the standard case as an exception leading to counter-intuitive case definitions and hardly readable business logic.

> [!NOTE]
> While keeping the current public interface of the class we could split the logic so that:
>
> - the process of the dataset could be something else, faster than sequential
> - the standard case become the default process path and business rules become exceptions
> - business rules could be contained outside of the `Pharmacy` class, maybe by implementing an interface for the `Drug` class that could allow us to use the strategy design pattern.
>
> Also:
>
> - internal data are being mutated, evaluation has to be done to know if side effects are used by "other pieces of the software".
> - Data alterations are not tracked, maybe pivoting toward event sourcing design could be a plus in terms of data safety that could also lead to predictability if plugged as training data to an AI.
