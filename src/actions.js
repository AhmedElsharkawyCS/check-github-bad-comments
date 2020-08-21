const Message = require("./messages");
class Action {
  constructor() {}
  static async onActionClassify(context, toxicity, octokit, customMessage, threshold, repository) {
    const imageTagWidth = 400;
    const issueNumber = context.payload.pull_request.number;
    const model = await toxicity.load(threshold);
    const reviewComment = [context.payload.review.body];
    const reviewObject = context.payload.review;
    const commentAuthor = reviewObject?.user?.login;
    let toxicComment = reviewComment ? reviewComment[0] : "no comment";
    const msgInstance = new Message(toxicComment, commentAuthor);
    model.classify(reviewComment).then((predictions) => {
      predictions.forEach((prediction) => {
        if (toxicComment) {
          return;
        }
        prediction.results.forEach((result, index) => {
          if (toxicComment) {
            return;
          }
          if (result.match) {
            const message = customMessage || msgInstance.generate(imageTagWidth);
            return octokit.issues.createComment({
              owner: repository.owner.login,
              repo: repository.name,
              issue_number: issueNumber,
              body: message,
            });
          }
        });
      });
    });
  }
}

module.exports = Action;
