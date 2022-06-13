import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtfsModule } from 'src/jwtfs/jwtfs.module';
import { User, UserSchema } from 'src/schemas/users.schema';
import { UserResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
	imports: [
		JwtfsModule,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	providers: [UsersService, UserResolver],
})
export class UsersModule {}
