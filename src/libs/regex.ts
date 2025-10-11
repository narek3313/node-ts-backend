/* length is 3-20, should start with a letter */
export const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

/* Should have 1 uppercase, 1 lowercase, 1 special char, 1 digit, and length is 8-64 */
export const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,64}$/;

/* Should be valid avatar url, extensions are allowed */
export const MEDIA_URL_REGEX =
    /^(https?:\/\/)(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost)(:\d{1,5})?(\/[^\s]+\.(png|jpg|jpeg|webp|gif))$/i;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const JWT_TOKEN_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
