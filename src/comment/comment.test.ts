import * as core from '@actions/core';
import * as github from "@actions/github";
import { postComment } from './comment';
import { createIssueComment, IssueComment, listIssueComments, updateIssueComment } from '../api/api';

const mockOctokit = undefined;
const mockContext = {
  repo: {
    repo: 'dummy-repo',
    owner: 'dummy-owner',
  },
  issue: {
    number: 10,
  },
};

jest.mock('../api/api');

jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
}));

jest.mock('@actions/github');
const actionsGithubMock = jest.requireMock('@actions/github');
actionsGithubMock.getOctoKit = jest.fn(() => mockOctokit);
actionsGithubMock.context = mockContext;

describe('comment', () => {
  beforeEach(() => {
    (createIssueComment as jest.Mock).mockResolvedValue(undefined);
    (updateIssueComment as jest.Mock).mockResolvedValue(undefined);
    (listIssueComments as jest.Mock).mockResolvedValue([]);
  });

  describe('postComment', () => {
    const token = 'github-token';
    const message = 'This is a message!';
    let marker = '';

    describe('given marker is not provided', () => {
      test('creates new comment', async() => {
        const expectedBody = message;

        await postComment(token, marker, message);

        expect(core.setFailed).not.toHaveBeenCalled();
        expect(github.getOctokit).toHaveBeenCalledWith(token);
        expect(listIssueComments).not.toHaveBeenCalled();
        expect(createIssueComment).toHaveBeenCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, mockContext.issue.number, expectedBody);
        expect(updateIssueComment).not.toHaveBeenCalled();
      });
    });

    describe('given marker is provided', () => {
      beforeEach(() => {
        marker = '<!-- some-unique-text -->';
      });

      describe('and no existing matching comment is found', () => {
        test('creates new comment', async() => {
          const expectedBody = `${message}\n\n${marker}`;

          await postComment(token, marker, message);

          expect(core.setFailed).not.toHaveBeenCalled();
          expect(github.getOctokit).toHaveBeenCalledWith(token);
          expect(listIssueComments).toHaveBeenCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, mockContext.issue.number);
          expect(createIssueComment).toHaveBeenCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, mockContext.issue.number, expectedBody);
          expect(updateIssueComment).not.toHaveBeenCalled();
        });
      });

      describe('and an existing matching comment is found', () => {
        let existingComment: IssueComment;

        beforeEach(() => {
          existingComment = {
            id: 10,
            body: `Existing comment\n\n${marker}`,
          } as IssueComment;
          (listIssueComments as jest.Mock).mockResolvedValue([existingComment]);
        });

        test('updates comment', async() => {
          const expectedBody = `${message}\n\n${marker}`;

          await postComment(token, marker, message);

          expect(core.setFailed).not.toHaveBeenCalled();
          expect(github.getOctokit).toHaveBeenCalledWith(token);
          expect(listIssueComments).toHaveBeenCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, mockContext.issue.number);
          expect(createIssueComment).not.toHaveBeenCalled();
          expect(updateIssueComment).toHaveBeenCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, existingComment.id, expectedBody);
        });
      });
    });

    describe('given pr number is NaN', () => {
      beforeEach(() => {
        actionsGithubMock.context.issue.number = undefined;
      });

      test('sets action status to failed', async() => {
        await postComment(token, marker, message);

        expect(core.setFailed).toHaveBeenCalledTimes(1);
        expect(github.getOctokit).toHaveBeenCalledWith(token);
        expect(listIssueComments).not.toHaveBeenCalled();
        expect(createIssueComment).not.toHaveBeenCalled();
        expect(updateIssueComment).not.toHaveBeenCalled();
      });
    });
  });
});
