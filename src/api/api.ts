import { GitHub } from '@actions/github/lib/utils';
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types/dist-types/GetResponseTypeFromEndpointMethod';

type Octokit = InstanceType<typeof GitHub>;
export type IssueComment = GetResponseDataTypeFromEndpointMethod<InstanceType<typeof GitHub>['rest']['issues']['listComments']> extends (infer U)[] ? U : never;

export const createIssueComment = async (octokit: Octokit, owner: string, repo: string, issueNumber: number, body: string) => {
  return await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
};

export const updateIssueComment = async (octokit: Octokit, owner: string, repo: string, commentId: number, body: string) => {
  return await octokit.rest.issues.updateComment({
    owner,
    repo,
    comment_id: commentId,
    body,
  });
};

export const listIssueComments = async (octokit: Octokit, owner: string, repo: string, issueNumber: number) => {
  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
  });

  return comments;
};
