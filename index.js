import core from "@actions/core";
import GitHubProject from "github-project";
import github from "@actions/github";

const run = async () => {
  try {
    const owner = core.getInput("owner");
    const project_id = Number(core.getInput("project-id"));
    const github_token = core.getInput("github-token");
    const closedIssueColumns = core.getInput("closed-issue-columns").split(",");
    const openIssueColumns = core.getInput("open-issue-columns").split(",");

    const octokit = await github.getOctokit(github_token);

    const project = new GitHubProject({
      owner,
      number: project_id,
      token: github_token,
    });

    const items = await project.items.list();
    const archivedRepository = new Set();
    const filteredIssueItems = [];

    for (const item of items) {
      if (!(item.type == "ISSUE" && !item.archived)) {
        continue;
      }

      if (archivedRepository.has(item.content.repository)) {
        continue;
      }

      try {
        const { data: repo } = await octokit.rest.repos.get({
          owner,
          repo: item.content.repository,
        });

        if (repo.archived) {
          archivedRepository.add(item.content.repository);
          continue;
        }
      } catch (error) {
        console.log(error);
        continue;
      }

      filteredIssueItems.push(item);
    }

    const filteredItemsToClose = filteredIssueItems.filter(
      (item) =>
        closedIssueColumns.includes(item.fields.status) && !item.content.closed
    );
    const filteredItemsToOpen = filteredIssueItems.filter(
      (item) =>
        openIssueColumns.includes(item.fields.status) && item.content.closed
    );

    await Promise.all(
      filteredItemsToClose.map(async (item) => {
        return await octokit.rest.issues.update({
          owner,
          repo: item.content.repository,
          issue_number: item.content.number,
          state: "closed",
        });
      })
    );

    await Promise.all(
      filteredItemsToOpen.map(
        async (item) =>
          await octokit.rest.issues.update({
            owner,
            repo: item.content.repository,
            issue_number: item.content.number,
            state: "open",
          })
      )
    );

    if (filteredItemsToOpen.length + filteredItemsToClose.length > 0) {
      core.setOutput(
        "issues",
        JSON.stringify({
          closed: filteredItemsToClose,
          opened: filteredItemsToOpen,
        })
      );
    } else {
      core.setOutput("issues", "");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
