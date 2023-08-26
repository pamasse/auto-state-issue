# auto-state-issue

```
name: test

jobs:
  test:
    name: test
    runs-on: ubuntu-latest

    steps:
      - name: test
        uses: pamasse/auto-state-issue@v1
        with:
          owner: Vestack
          project-id: 6
          github-token: ${{ secrets.PROJECT_PAT }}
          closed-issue-columns: Done
          open-issue-columns: Bugs,To Do,In Progress,To Review

```
