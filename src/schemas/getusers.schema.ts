import { ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import { User } from './users.schema';

@ObjectType()
export class GetUsers extends PartialType(
	OmitType(User, ['password'] as const),
) {}
