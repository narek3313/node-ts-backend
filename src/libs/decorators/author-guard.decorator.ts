import {
    CanActivate,
    ExecutionContext,
    ForbiddenException as Http403,
    Inject,
    NotFoundException as Http404,
} from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from 'src/modules/auth/jwt/jwt.strategy';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { POST_REPOSITORY } from 'src/modules/posts/post.di-tokens';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export const AUTHOR_GUARD = Symbol('AUTHOR_GUARD');

export const SKIP_AUTHOR_GUARD_KEY = 'skipAuthorGuard';

export const SkipAuthorGuard = () => SetMetadata(SKIP_AUTHOR_GUARD_KEY, true);

export class AuthorGuard implements CanActivate {
    constructor(
        @Inject(POST_REPOSITORY) private readonly postRepo: PostRepository,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext) {
        const skip = this.reflector.getAllAndOverride<boolean>(SKIP_AUTHOR_GUARD_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (skip) return true;

        const req = context.switchToHttp().getRequest<RequestWithUser>();

        const postId = req.params.id || req.params.postId;

        if (!postId || !req.user) {
            throw new Http403('Missing user or post ID');
        }

        const authorId = await this.postRepo.getAuthorIdById(Uuid4.from(postId));

        if (!authorId) {
            throw new Http404('Post not found');
        }

        if (authorId.value !== req.user.sub) {
            throw new Http403('You are not the author');
        }

        return true;
    }
}
