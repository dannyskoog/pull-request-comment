import * as core from '@actions/core';
import * as github from '@actions/github';
import { createIssueComment, IssueComment, listIssueComments, updateIssueComment } from '../api/api';

export const postComment = async (token: string, marker: string, message: string) => {
  const octokit = github.getOctokit(token);
  let { repo: { repo, owner }, issue: { number: prNumber } } = github.context;

  if (isNaN(prNumber)) {
    core.setFailed('Pull request number could not be inferred from GitHub context. Please check that the event that triggered the workflow provides it');
    return;
  }

  if (marker) {
    const comments = await listIssueComments(octokit, owner, repo, prNumber);
    const comment = findCommentBySubstring(comments, marker);

    if (comment) {
      await updateIssueComment(octokit, owner, repo, comment.id, messageWithMarker(message, marker));
    } else {
      await createIssueComment(octokit, owner, repo, prNumber, messageWithMarker(message, marker));
    }
  } else {
    await createIssueComment(octokit, owner, repo, prNumber, message);
  }
};

const findCommentBySubstring = (comments: IssueComment[], str: string) => {
  return comments.find(comment => comment.body?.includes(str));
};

const messageWithMarker = (message: string, marker: string) => {
  return `${message}\n\n${marker}`;
};
