import { ApiHeader } from '@nestjs/swagger';

export const ApiCookie = () =>
    ApiHeader({
        name: 'Cookie',
        description: `
    Requires HttpOnly cookies set by login:
    - refreshToken: HttpOnly, Secure, SameSite=Lax

    Note: Swagger cannot send HttpOnly cookies. Use Postman or a real client.
  `,
        required: true,
        example: 'refreshToken=abc123; sessionId=xyz456',
    });
