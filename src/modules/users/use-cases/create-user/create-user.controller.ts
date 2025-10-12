import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller()
export class CreateUserHttpController {
    constructor(private readonly commandBud: CommandBus) {}
}
