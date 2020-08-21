class Message {
  badComment;
  creator;
  constructor(comment, author) {
    this.badComment = comment;
    this.creator = author;
  }
  generate(imgTagWidth = 400) {
    const fixedGif = `https://media.giphy.com/media/lz67zZWfWPsWnuGH0s/giphy.gif`;
    const fixedImgTag = `<img src=${fixedGif} width=${imgTagWidth}/>`;
    const fixedMessage = `${fixedImgTag}<br/>Hey &quot;${this.creator}&quot; &#128587;<br/>Please remove or update your comment &#128591; coz this repository should be safe environment and your comment <b>${this.badComment}</b> classified as potential toxic comment`;
    return fixedMessage;
  }
}

module.exports = Message;
