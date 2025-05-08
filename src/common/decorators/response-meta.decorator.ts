import { SetMetadata } from '@nestjs/common';
import { RESPONSE_META_KEY } from '../constants/response-meta.constants';
import IResponseMeta from '../interfaces/response-meta.interface';

/**
 * Responsible for setting the type of response. It houses an object containing the message and statusCode
 *
 */

export const ResponseMeta = (meta: IResponseMeta) =>
  SetMetadata(RESPONSE_META_KEY, meta);
