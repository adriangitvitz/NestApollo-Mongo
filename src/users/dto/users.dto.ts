import { Field, InputType } from '@nestjs/graphql';
import {
	MinLength,
	IsOptional,
	Length,
	Matches,
	MaxLength,
} from 'class-validator';

@InputType()
export class UsersInput {
	@Field()
	@MaxLength(20)
	username: string;

	@Field()
	@MinLength(8)
	@MaxLength(32)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'Password is weak',
	})
	password: string;

	@Field({ nullable: true })
	@IsOptional()
	@Length(30, 255)
	description?: string;
}
