import { PrismaService } from 'src/db/prisma/prisma.service';
import { CommentsRepositoryContract } from '../domain/repository.contract';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Comment } from '../comment.entity';
import { CommentCreateError } from '../comment.errors';

export class CommentRepository implements CommentsRepositoryContract {
    constructor(private readonly prisma: PrismaService) {}

    async create(_comment: Comment): Promise<Uuid4> {
        try {
            const comment = _comment.toObject();

            await this.prisma.comment.create({
                data: { ...comment },
            });
            return _comment.id;
        } catch (err) {
            throw new CommentCreateError(err);
        }
    }
}
