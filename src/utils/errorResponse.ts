export class ErrorResponse extends Error {
    statuscode:number
    constructor(message:string,statuscode:number){
        super(message)
        this.statuscode = statuscode
    }
}