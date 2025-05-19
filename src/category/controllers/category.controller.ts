import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CategoryService } from '../providers/category.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthType } from '../../auth/enums/auth-type.enums';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import { SystemMessages } from '../../common/helpers/messages/system.messages';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ResponseMeta({
    message: SystemMessages.SUCCESS.FETCHED_RESOURCE,
    statusCode: HttpStatus.OK,
  })
  @Auth(AuthType.NONE)
  @Get('list-categories')
  public async listCategories() {
    return await this.categoryService.listCategories();
  }
}
