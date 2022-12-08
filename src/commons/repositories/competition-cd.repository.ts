import { Competition } from '@competitions/models/entities/competition.entity';
import { EntityManager } from 'typeorm';

// I know this is ugly as I Should ise repository: I found out circular dependency issue and
// I couldn't solve it, instead use a simple way to avoid that using this hack
// based on https://blog.logrocket.com/avoid-circular-dependencies-nestjs/#:~:text=Avoiding%20circular%20dependencies%20by%20refactoring,-The%20NestJS%20documentation&text=Circular%20dependencies%20create%20tight%20couplings,either%20of%20them%20is%20changed.
export const findCompetition = async (
  code: string,
  entityManager: EntityManager,
): Promise<Competition> => {
  return await entityManager.findOne<Competition>(Competition, {
    where: { code },
  });
};
