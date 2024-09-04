import * as core from '@actions/core';
import { postComment } from './comment/comment';

async function run() {
  try {
    // Read inputs
    const message = core.getInput('message', { required: true });
    const marker = core.getInput('marker');
    const token = core.getInput('token');

    // Post comment
    await postComment(token, marker, message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error.message;
    core.setFailed(message);
  }
}

run();
