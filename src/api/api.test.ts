import { createIssueComment, IssueComment, listIssueComments, Octokit, updateIssueComment } from './api';

describe('api', () => {
  const mockIssueComment: Partial<IssueComment> = {
    id: 15,
  };  
  let mockOctokit: Octokit;
  const owner = 'dummy-owner';
  const repo = 'dummy-repo';
  const body = 'This is a message!';

  beforeEach(() => {
    mockOctokit = {
      rest: {
        issues: {
          createComment: jest.fn().mockResolvedValue(mockIssueComment),
          updateComment: jest.fn().mockResolvedValue(mockIssueComment),
          listComments: jest.fn().mockResolvedValue({ data: [mockIssueComment] }),
        },
      },
    } as unknown as Octokit;
  });

  describe('createIssueComment', () => {
    test("should invoke 'createComment' API function", async() => {
      const issueNumber = 10;

      const createdComment = await createIssueComment(mockOctokit, owner, repo, issueNumber, body);

      expect(mockOctokit.rest.issues.createComment).toBeCalledWith({ owner, repo, issue_number: issueNumber, body });
      expect(createdComment).toEqual(mockIssueComment);
    });
  });

  describe('updateIssueComment', () => {
    test("should invoke 'updateComment' API function", async() => {
      const commentId = 20;

      const updatedComment = await updateIssueComment(mockOctokit, owner, repo, commentId, body);
    
      expect(mockOctokit.rest.issues.updateComment).toBeCalledWith({ owner, repo, comment_id: commentId, body });
      expect(updatedComment).toEqual(mockIssueComment);
    });
  });

  describe('listIssueComments', () => {
    test("should invoke 'listComments' API function", async() => {
      const issueNumber = 10;
    
      const comments = await listIssueComments(mockOctokit, owner, repo, issueNumber);
      
      expect(mockOctokit.rest.issues.listComments).toBeCalledWith({ owner, repo, issue_number: issueNumber });
      expect(comments).toEqual([mockIssueComment]);
    });
  });
});
