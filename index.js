const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
    try {
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pr_number = core.getInput('pr_number', { required: true });
        const token = core.getInput('token', { required: true });
        const octokit = new github.getOctokit(token);
        const { data: changedFiles } = await octokit.rest.pulls.listFiles({
            owner,
            repo,
            pull_number: pr_number,
        });
        let diffData = {
            additions: 0,
            deletions: 0,
            changes: 0
        };

        console.log(changedFiles);

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();
