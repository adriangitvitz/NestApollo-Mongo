import { Module } from '@nestjs/common';
import { JwtfsService } from './jwtfs.service';

@Module({
	providers: [JwtfsService],
	exports: [JwtfsService],
})
export class JwtfsModule {}
