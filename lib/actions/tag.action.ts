import { PaginationSearchParamsIF, TagIF } from '@/types/global';

import { constructorApi } from '../api';
import handleError from '../handlers/error.handler';
import GuardGateway from '../handlers/guard.handler';
import handleSuccess from '../handlers/success.handler';
import { PaginationSearchParamsSchema } from '../validations';

export async function getTags(params: PaginationSearchParamsIF): ServerResponse<{
  tags: TagIF[];
  isNext: boolean;
  total: number;
}> {
  try {
    const validationResult = await GuardGateway({
      params,
      schema: PaginationSearchParamsSchema,
    });
    const { params: validatedParams } = validationResult;
    const tags = await constructorApi.tags.getAll(validatedParams!);
    if (!tags.success || !tags.data) return tags;
    return handleSuccess({
      data: tags.data,
      message: 'Tags fetched successfully',
      responseType: 'server',
    });
  } catch (error) {
    return handleError({
      error,
      responseType: 'server',
    }) as ErrorResponse;
  }
}
