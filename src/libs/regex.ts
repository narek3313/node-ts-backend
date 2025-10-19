/* length is 3-20, should start with a letter */
export const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

/* Should have 1 uppercase, 1 lowercase, 1 special char, 1 digit, and length is 8-64 */
export const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,64}$/;

export const HASH_REGEX = /^[a-f0-9]{32}\$[a-f0-9]{128}$/i;

/* Should be valid avatar url, extensions are allowed */
export const MEDIA_URL_REGEX =
    /^(https?:\/\/)([\w.-]+|\blocalhost\b)(:\d{1,5})?(\/[^\s?#]+?\.(png|jpg|jpeg|webp|gif))(?:\?[^\s#]*)?$/i;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const JWT_TOKEN_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
