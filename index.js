const core = require('@actions/core');
const github = require('@actions/github');
const { ESLint } = require('eslint');

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

        const paths = changedFiles.map(({ filename }) => filename);
        // 1. Create an instance with the `fix` option.
        const eslint = new ESLint({ fix: true });
        // 2. Lint files. This doesn't modify target files.
        const results = await eslint.lintFiles(paths);
        // 3. Modify the files with the fixed code.
        await ESLint.outputFixes(results);
        // 4. Format the results.
        const formatter = await eslint.loadFormatter('stylish');
        const resultText = formatter.format(results);

        console.log(resultText);

    } catch (error) {
        core.setFailed(error.message);
    }
};

// Call the main function to run the action
main();
