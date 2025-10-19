import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { UserAgent } from '../../domain/value-objects/user-agent.vo';
import { IpAddress } from '../../domain/value-objects/ip-address.vo';

export class LoginCommand extends Command {
    readonly userAgent: UserAgent;
    readonly ipAddress: IpAddress;
    readonly email: Email;
    readonly password: Password;

    constructor(props: CommandProps<LoginCommand>) {
        super(props);
        this.userAgent = props.userAgent;
        this.ipAddress = props.ipAddress;
        this.email = props.email;
        this.password = props.password;
    }
}
