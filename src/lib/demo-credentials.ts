// Plain constants (no server-only deps) so both the client login page and the server seed
// script can reference the same demo admin credentials without bundling Prisma into the browser.
export const SEED_ADMIN_EMAIL = 'admin@mehndibydhara.com';
export const SEED_ADMIN_PASSWORD = 'ChangeMe123!';
