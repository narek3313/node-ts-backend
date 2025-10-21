import { Command, CommandProps } from 'src/libs/ddd/command.base';
export class RefreshCommand extends Command {
    readonly refreshToken: string;
    readonly sessionId: string;

    constructor(props: CommandProps<RefreshCommand>) {
        super(props);
        this.refreshToken = props.refreshToken;
        this.sessionId = props.sessionId;
    }
}
