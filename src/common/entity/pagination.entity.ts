import { PaginationProps } from '../dto/pagination-req.dto';
import { Page } from '../dto/pagination-res.dto';

export async function listPaginatedEntity<T, U>(
  pageProps: PaginationProps,
  results: [T[], number],
  mapper: (entity: T) => U,
): Promise<Page<U>> {
  const { page, take } = pageProps;

  const [entities, count] = results;

  const entityResult = entities.map(mapper);

  return new Page<U>(page, take, count, entityResult);
}
