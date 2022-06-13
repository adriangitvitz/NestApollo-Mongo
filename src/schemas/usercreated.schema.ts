import { Field, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import { User } from './users.schema';

@ObjectType()
export class Usercreated extends PartialType(
	OmitType(User, ['password', 'description'] as const),
) {
	@Field(() => String, { description: 'Status' })
	status: string;
}
