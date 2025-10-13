const usersRoot = 'users';

const v1 = 'v1';

export const routesV1 = {
    version: v1,
    user: {
        root: usersRoot,
        delete: `/${usersRoot}/:id`,
    },
};
