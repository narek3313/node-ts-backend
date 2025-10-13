import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { Password } from 'src/modules/auth/domain/value-objects/password.vo';
import { Username } from 'src/modules/auth/domain/value-objects/username.vo';

export class CreateUserCommand extends Command {
    readonly email: Email;
    readonly username: Username;
    readonly password: Password;

    constructor(props: CommandProps<CreateUserCommand>) {
        super(props);
        this.email = props.email;
        this.username = props.username;
        this.password = props.password;
    }
}
