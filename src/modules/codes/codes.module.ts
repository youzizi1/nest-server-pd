import { Module } from '@nestjs/common';
import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Code } from './code.entity';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Code]), UsersModule, CategoriesModule],
  controllers: [CodesController],
  providers: [CodesService],
})
export class CodesModule {}
