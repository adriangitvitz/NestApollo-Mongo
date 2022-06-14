import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'sigin' })
export class SignInCredentials {
	@Field()
	accesstoken: string;

	@Field()
	refreshtoken: string;
}
