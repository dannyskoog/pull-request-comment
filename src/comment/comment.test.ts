import * as core from '@actions/core';
import * as github from "@actions/github";
import { postComment } from './comment';
import { createIssueComment, IssueComment, listIssueComments, updateIssueComment } from '../api/api';

jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
}));

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(() => mockOctokit),
  get context() {
    return getMockContext();
  },
}));

jest.mock('../api/api', () => ({
  listIssueComments:jest.fn(() => Promise.resolve([])),
  createIssueComment: jest.fn(() => Promise.resolve()),
  updateIssueComment: jest.fn(() => Promise.resolve()),
}));

const mockOctokit = {};
const mockContext = {
  repo: {
    repo: 'dummy-repo',
    owner: 'dummy-owner',
  },
  issue: {
    number: 10,
  },
};
let getMockContext = jest.fn(() => mockContext);

describe('postComment', () => {
  const token = 'github-token';
  const message = 'This is a message!';
  let marker = '';

  describe('given marker is not provided', () => {
    test('creates new comment', async() => {
      const expectedBody = message;

      await postComment(token, marker, message);

      expect(core.setFailed).not.toBeCalled();
      expect(github.getOctokit).toBeCalledWith(token);
      expect(listIssueComments).not.toBeCalled();
      expect(createIssueComment).toBeCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, mockContext.issue.number, expectedBody);
      expect(updateIssueComment).not.toBeCalled();
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

        expect(core.setFailed).not.toBeCalled();
        expect(github.getOctokit).toBeCalledWith(token);
        expect(listIssueComments).toBeCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, mockContext.issue.number);
        expect(createIssueComment).toBeCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, mockContext.issue.number, expectedBody);
        expect(updateIssueComment).not.toBeCalled();
      });
    });

    describe('and an existing matching comment is found', () => {
      let existingComment: IssueComment;

      beforeEach(() => {
        existingComment = {
          id: 10,
          body: `Existing comment\n\n${marker}`,
        } as IssueComment;
        (listIssueComments as jest.Mock).mockReturnValueOnce(Promise.resolve([existingComment]));
      });

      test('updates comment', async() => {
        const expectedBody = `${message}\n\n${marker}`;

        await postComment(token, marker, message);

        expect(core.setFailed).not.toBeCalled();
        expect(github.getOctokit).toBeCalledWith(token);
        expect(listIssueComments).toBeCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, mockContext.issue.number);
        expect(createIssueComment).not.toBeCalled();
        expect(updateIssueComment).toBeCalledWith(mockOctokit, mockContext.repo.owner, mockContext.repo.repo, existingComment.id, expectedBody);
      });
    });
  });

  describe('given pr number is NaN', () => {
    beforeEach(() => {
      getMockContext.mockReturnValueOnce({ ...mockContext, issue: { ...mockContext.issue, number: undefined as any }});
    });

    test('sets action status to failed', async() => {
      await postComment(token, marker, message);

      expect(core.setFailed).toBeCalledTimes(1);
      expect(github.getOctokit).toBeCalledWith(token);
      expect(listIssueComments).not.toBeCalled();
      expect(createIssueComment).not.toBeCalled();
      expect(updateIssueComment).not.toBeCalled();
    });
  });
});
