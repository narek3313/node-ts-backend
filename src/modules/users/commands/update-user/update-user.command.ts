import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { Password } from 'src/modules/auth/domain/value-objects/password.vo';
import { Username } from 'src/modules/auth/domain/value-objects/username.vo';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class ChangeUserEmailCommand extends Command {
    readonly userId: Uuid4;
    readonly email: Email;

    constructor(props: CommandProps<ChangeUserEmailCommand>) {
        super(props);
        this.email = props.email;
        this.userId = props.userId;
    }
}

export class ChangeUserUsernameCommand extends Command {
    readonly userId: Uuid4;
    readonly username: Username;

    constructor(props: CommandProps<ChangeUserUsernameCommand>) {
        super(props);
        this.username = props.username;
        this.userId = props.userId;
    }
}

export class ChangeUserPasswordCommand extends Command {
    readonly userId: Uuid4;
    readonly newPassword: Password;
    readonly oldPassword: Password;

    constructor(props: CommandProps<ChangeUserPasswordCommand>) {
        super(props);
        this.userId = props.userId;
        this.newPassword = props.newPassword;
        this.oldPassword = props.oldPassword;
    }
}

export class ChangeUserAvatarCommand extends Command {
    readonly userId: Uuid4;
    readonly avatar: MediaURL;

    constructor(props: CommandProps<ChangeUserAvatarCommand>) {
        super(props);
        this.userId = props.userId;
        this.avatar = props.avatar;
    }
}
