import { Statuses } from "../enums/statuses.enum";

export interface DeliveryFilterOptionsInterface {
    userId?: Array<number>;
    status?: Array<Statuses>;
    trackingIdentifier?: Array<string>;
}