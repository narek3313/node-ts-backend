const usersRoot = 'users';
const postsRoot = 'posts';
const authRoot = 'auth';

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
};
