type ApiErrorResponse =
    | {
          param: string;
          message: string;
      }[]
    | string;

export type { ApiErrorResponse };
