import { Request } from 'express';
import { GetUserData } from '../../common/interfaces/get-user-data.inteface';

export default interface ActiveUser extends Request {
  user: GetUserData;
}
