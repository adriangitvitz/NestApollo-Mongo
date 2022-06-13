import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { JwtfsModule } from './jwtfs/jwtfs.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration/configuration';
import { MongoModule } from './mongo/mongo.module';

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			debug: false,
			playground: false,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			sortSchema: true,
			plugins: [ApolloServerPluginLandingPageLocalDefault],
			context: ({ req }) => {
				return { request: req };
			},
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		UsersModule,
		JwtfsModule,
		MongoModule,
	],
})
export class AppModule {}
