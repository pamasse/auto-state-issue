import core from "@actions/core";
import GitHubProject from "github-project";

const run = async () => {
  try {
    const owner = core.getInput("owner");
    const project_id = Number(core.getInput("project-id"));
    const github_token = core.getInput("github-token");
    const closedIssueColumns = core.getInput("closed-issue-columns");
    const openIssueColumns = core.getInput("open-issue-columns");

    const project = new GitHubProject({
      owner,
      number: project_id,
      token: github_token,
    });

    const items = await project.items.list();

    const filteredItemsToClose = items.filter((item) =>
      closedIssueColumns.includes(item.fields.status && item.state == "open")
    );
    await Promise.all(
      filteredItemsToClose.map((item) =>
        project.items.update(item.id, { state: "closed" })
      )
    );

    const filteredItemsToOpen = items.filter((item) =>
      openIssueColumns.includes(item.fields.status && item.state == "closed")
    );
    await Promise.all(
      filteredItemsToOpen.map((item) =>
        project.items.update(item.id, { state: "closed" })
      )
    );

    if (filteredItemsToOpen || filteredItemsToClose) {
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
