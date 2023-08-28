# auto-state-issue

Strongly inspired by the [move-to-next-iteration](https://github.com/blombard/move-to-next-iteration) and [Issue States](https://github.com/dessant/issue-states) github actions.

```
name: Auto Close/Open Issues

on:
  schedule:
    # Runs "every hour at 0" (see https://crontab.guru)
    - cron: '0 * * * *'

jobs:
  Auto Close/Open Issues:
    name: Auto Close/Open Issues
    runs-on: ubuntu-latest

    steps:
      - name: Auto Close/Open Issues
        uses: pamasse/auto-state-issue@v1.0.5
        with:
          owner: Vestack
          project-id: 1
          github-token: ${{ secrets.PROJECT_PAT }}
          closed-issue-columns: Done
          open-issue-columns: Bugs,To Do,In Progress,To Review

```
