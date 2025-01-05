"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModel = void 0;
class ResponseModel {
    constructor(status, bodyMessage) {
        if (status < 400) {
            this.payload = bodyMessage;
        }
        else {
            if (Array.isArray(bodyMessage)) {
                this.errors = bodyMessage;
            }
            else {
                this.errors = [];
                this.errors.push(bodyMessage.toString());
            }
        }
        this.status = status;
    }
}
exports.ResponseModel = ResponseModel;
//# sourceMappingURL=response-model.js.map