import { Inject, Injectable } from '@nestjs/common';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Pagination } from '../interfaces/pagination.interface';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';

@Injectable()
export class PaginationProvider {
  constructor(
    /**
     * Import Express Request
     */
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<Pagination<T>> {
    const results = await repository.find({
      where: where || {},
      relations: relations || {},
      take: paginationQuery.limit,
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
    });

    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newURL = new URL(this.request.url, baseURL);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);
    const nextPage =
      paginationQuery.page === totalPages
        ? paginationQuery.page
        : paginationQuery.page + 1;
    const previousPage =
      paginationQuery.page === 1
        ? paginationQuery.page
        : paginationQuery.page - 1;

    return {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit,
        totalItems,
        currentPage: paginationQuery.page,
        totalPages,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
        previous: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
      },
    };
  }
}
