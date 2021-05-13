import { FieldError } from "../generated/graphql";

export const toMapError = (errors: FieldError[]) => {
  const mapError: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    mapError[field] = message;
  });
  return mapError;
};
