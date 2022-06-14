import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtfsService {
	constructor(private readonly configService: ConfigService) {}

	private readonly header = {
		alg: 'HS256',
		typ: 'JWT',
	};
	private readonly secret: string = this.configService.get<string>('jwtsecret');
	private readonly exp_hours: string = this.configService.get<string>('jwtexp');
	private readonly regex_time_type: RegExp = new RegExp(/(\d+)([h-m])(&|$)/g);

	sign(payload: any): string {
		const currentDate: Date = new Date();
		const issued_at: number = currentDate.getTime();
		const expires: number = this.generate_expiresin(currentDate);

		payload = this.clean_before(payload);
		const payload_data = { ...payload, exp: expires, ist: issued_at };
		const encodedheader: string = this.encodetobase64(this.header);
		const encodedpayload: string = this.encodetobase64(payload_data);
		const signature: string = this.create_signature(
			encodedheader,
			encodedpayload,
		);
		const jwt = `${encodedheader}.${encodedpayload}.${signature}`;
		return jwt;
	}

	isvalid(jwt: string): boolean {
		const { header_decoded, payload_decoded, signature } = this.decodedata(jwt);
		const encodedheader: string = this.encodetobase64(
			this.clean_before(header_decoded),
		);
		const encodedpayload: string = this.encodetobase64(
			this.clean_before(payload_decoded),
		);
		// TODO: Validate expiration date
		const validate: boolean = this.validate(
			encodedheader,
			encodedpayload,
			signature,
		);
		return validate;
	}

	decodejwtfs(jwt: string, options: { validate: boolean }) {
		const { header_decoded, payload_decoded, signature } = this.decodedata(jwt);
		if (options.validate) {
			const encodedheader: string = this.encodetobase64(
				this.clean_before(header_decoded),
			);
			const encodedpayload: string = this.encodetobase64(
				this.clean_before(payload_decoded),
			);
			const validate: boolean = this.validate(
				encodedheader,
				encodedpayload,
				signature,
			);
			if (validate) {
				return this.clean_before(payload_decoded);
			} else {
				throw new NotAcceptableException('JWT Invalid');
			}
		}
		return this.clean_before(payload_decoded);
	}

	private clean_before(data: string) {
		const validate_json: boolean = this.isJson(data);
		if (validate_json) {
			const data_parsed = JSON.parse(this.cleanstring(data.trim()));
			return data_parsed;
		}
		throw new NotAcceptableException('JWT Invalid');
	}

	private cleanstring(data: string): string {
		let output = '';
		for (let i = 0; i < data.length; i++) {
			if (data.charCodeAt(i) <= 127) {
				output += data.charAt(i);
			}
		}
		return output;
	}

	private isJson(data: string) {
		try {
			JSON.parse(data);
		} catch (e) {
			return false;
		}
		return true;
	}

	private generate_expiresin(date: Date): number {
		const exec_regex = this.regex_time_type.exec(this.exp_hours);
		if (exec_regex) {
			const exp_time = parseInt(exec_regex[1]);
			const exp_type = exec_regex[2];
			exp_type === 'h'
				? date.setTime(date.getTime() + exp_time * 60 * 60 * 1000)
				: date.setTime(date.getTime() + exp_time * 60 * 1000);
		} else {
			// Default 30 minutes
			date.setTime(date.getTime() + 30 * 60 * 1000);
		}
		return date.getTime();
	}

	private decodedata(jwt: string) {
		const chunks: string[] = jwt.split('.');
		const header_decoded: string = this.decodedbase64(chunks[0]);
		const payload_decoded: string = this.decodedbase64(chunks[1]);
		const signature: string = chunks[2] || '';
		return {
			header_decoded,
			payload_decoded,
			signature,
		};
	}

	private validate(
		encodedheader: string,
		encodedpayload: string,
		signature: string,
	): boolean {
		const signature_jwt: string = this.create_signature(
			encodedheader,
			encodedpayload,
		);
		if (signature_jwt === signature) {
			return true;
		}
		return false;
	}

	private bytes_string(data: any): Buffer {
		return Buffer.from(JSON.stringify(data), 'utf-8');
	}

	private encodetobase64(data: any): string {
		return Buffer.from(this.bytes_string(data))
			.toString('base64')
			.replace(/\+/g, '_')
			.replace(/\//g, '-')
			.replace(/=+$/g, '');
	}

	private decodedbase64(data: any): string {
		return Buffer.from(data, 'base64').toString();
	}

	private create_signature(
		encodedheader: string,
		encodedpayload: string,
	): string {
		const hash: string = crypto
			.createHmac('SHA256', this.secret)
			.update(`${encodedheader}.${encodedpayload}`)
			.digest('base64')
			.replace(/\+/g, '_')
			.replace(/\//g, '-')
			.replace(/=+$/g, '');
		return hash;
	}
}
