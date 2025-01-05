export class ResponseModel<T> {
    constructor(status: number, bodyMessage?: T) {
        if (status < 400) {
            this.payload = bodyMessage;
        } else {
            if (Array.isArray(bodyMessage)) {
                this.errors = bodyMessage;
            } else {
                this.errors = [];
                this.errors.push(bodyMessage.toString());
            }
        }
        this.status = status;
    }

    errors?: Array<string>;
    payload?: T;
    status: number;
}
