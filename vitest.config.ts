import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.e2e-spec.ts'],
        setupFiles: ['test/setup.ts'],
        clearMocks: true,
        restoreMocks: true,
        reporters: ['default'],
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage',
        },
    },
});
