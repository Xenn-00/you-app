import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

export interface WebResponse<T> {
  data?: T;
  errors?: string;
}

export const ApiWebResponse = <TModel extends Type<unknown>>(model: TModel) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        type: "object",
        properties: {
          data: { $ref: getSchemaPath(model) },
        },
      },
    }),
  );
