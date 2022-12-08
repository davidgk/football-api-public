import { ApolloDriver } from '@nestjs/apollo';

export const graphqlParams = {
  driver: ApolloDriver,
  autoSchemaFile: true,
};
