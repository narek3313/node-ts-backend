const usersRoot = 'users';
const postsRoot = 'posts';
const authRoot = 'auth';
const commentsRoot = 'comments';
const repliesRoot = 'replies';

// Removed the version because now its set in main.ts
// Will remove this in future
const v1 = '';

export const routesV1 = {
    version: v1,
    user: {
        root: usersRoot,
        delete: `/${usersRoot}/:id`,
    },

    post: {
        root: postsRoot,
        delete: `/${postsRoot}/:id`,
    },

    auth: {
        root: authRoot,
    },

    comment: {
        root: `${postsRoot}/:postId/${commentsRoot}`,
        delete: `/${commentsRoot}/:id`,
    },

    reply: {
        root: `${commentsRoot}/:commentId/${repliesRoot}`,
        delete: `${commentsRoot}/:commentId/${repliesRoot}/:id`,
    },
};
