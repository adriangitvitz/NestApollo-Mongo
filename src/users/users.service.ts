import {
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtfsService } from 'src/jwtfs/jwtfs.service';
import { User } from 'src/schemas/users.schema';
import { JwtCredentials } from './dto/credentials.dto';
import { JwtPayload } from './dto/jwtpayload.dto';
import { UsersInput } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { Usercreated } from 'src/schemas/usercreated.schema';

@Injectable()
export class UsersService {
	constructor(
		private jwtfs: JwtfsService,
		@InjectModel(User.name)
		private readonly usermodel: Model<User>,
	) {}

	async getUsers(): Promise<User[]> {
		return this.usermodel.find().exec();
	}

	async createUser(data: UsersInput): Promise<Usercreated> {
		const { username, password } = data;
		const salt = await bcrypt.genSalt();
		const hashed_password = await bcrypt.hash(password, salt);
		const payload: UsersInput = { username, password: hashed_password };
		const user = new this.usermodel(payload);
		try {
			const id = (await user.save())._id;
			const saved_data: Usercreated = {
				_id: id,
				username: username,
				status: 'created',
			};
			return saved_data;
		} catch (error) {
			let error_data: Usercreated = {
				username: username,
				status: 'Error creating user',
			};
			if (error.code === 11000) {
				error_data = { ...error_data, status: 'Username already exists' };
			}
			return error_data;
		}
	}

	async signIn(data: UsersInput): Promise<JwtCredentials> {
		const { username } = data;
		// const user: User = { ...data, id: '1' };
		const jwtpayload: JwtPayload = { username };
		const accesstoken: string = this.jwtfs.sign(jwtpayload);
		const jwtdata: JwtCredentials = { accesstoken };
		return jwtdata;
	}
}
