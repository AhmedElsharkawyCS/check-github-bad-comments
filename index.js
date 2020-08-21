const core = require("@actions/core");
const { context } = require("@actions/github");
const { Octokit } = require("@octokit/rest");
const tf = require("@tensorflow/tfjs");
const toxicity = require("@tensorflow-models/toxicity");
const Action = require("./src/actions");

async function runAction() {
  await tf.setBackend("cpu");
  try {
    const githubToken = core.getInput("GITHUB_TOKEN");
    const octokit = new Octokit({ auth: githubToken });
    const customMessage = core.getInput("message");
    const toxicityThreshold = core.getInput("toxicity_threshold");
    const repository = context.payload.repository;
    const threshold = toxicityThreshold ? toxicityThreshold : 0.9;
    if (context.payload.review && context.payload.action === "submitted") {
      await Action.onActionClassify(context, toxicity, octokit, customMessage, threshold, repository);
    }
    if (context.payload.comment && (context.payload.action === "created" || context.payoad.action === "edited")) {
      await Action.onActionClassify(context, toxicity, octokit, customMessage, threshold, repository);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
runAction();
