import {
    Controller,
    Get,
    NotFoundException as Http404,
    Param,
    ParseUUIDPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { GetUserByIdQuery } from './find-users.query-handler';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Result, match } from 'oxide.ts';
import { User } from '../../domain/user.entity';
import { NotFoundException } from 'src/libs/exceptions/exceptions';

@Controller(routesV1.version)
export class FindUsersHttpController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get(`${routesV1.user.root}/:id`)
    async getUserById(@Param('id', new ParseUUIDPipe({ version: '4' })) _id: string) {
        const query = new GetUserByIdQuery(Uuid4.from(_id));

        const result: Result<User, NotFoundException> = await this.queryBus.execute(query);

        return match(result, {
            Ok: (user: User) => user,
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err.message);
                throw err;
            },
        });
    }
}
