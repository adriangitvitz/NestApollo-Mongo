import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { JwtfsGuard } from 'src/jwtfs/jwtfs.guard';
import { GetUsers } from 'src/schemas/getusers.schema';
import { Usercreated } from 'src/schemas/usercreated.schema';
import { User } from 'src/schemas/users.schema';
import { JwtCredentials } from './dto/credentials.dto';
import { UsersInput } from './dto/users.dto';
import { SignInCredentials } from './models/credentials.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UsersService) {}

	@UseGuards(JwtfsGuard)
	@Query(() => [GetUsers], { name: 'users' })
	async users(): Promise<GetUsers[]> {
		const user = await this.userService.getUsers();
		return user;
	}

	@Mutation(() => Usercreated)
	async createUser(@Args('userdata') userInput: UsersInput) {
		return this.userService.createUser(userInput);
	}

	@Mutation(() => SignInCredentials)
	async signIn(
		@Args('userdata') userInput: UsersInput,
	): Promise<JwtCredentials> {
		const credentials = await this.userService.signIn(userInput);
		return credentials;
	}
}
