import { Request } from 'express';
import { GetUserData } from './get-user-data.inteface';

export default interface ActiveUser extends Request {
  user: GetUserData;
}
