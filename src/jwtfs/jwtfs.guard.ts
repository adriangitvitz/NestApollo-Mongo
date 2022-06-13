import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { JwtfsService } from './jwtfs.service';

@Injectable()
export class JwtfsGuard implements CanActivate {
	constructor(private jwtfs: JwtfsService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const ctx = GqlExecutionContext.create(context);
		// getInfo() return the information from the graphql query
		const request = ctx.getContext().request;
		const authorization = request.get('Authorization');
		if (authorization) {
			const bearertoken: string = authorization.replace('Bearer ', '');
			const validation: boolean = this.jwtfs.isvalid(bearertoken);
			return validation;
		}
		return false;
	}
}
