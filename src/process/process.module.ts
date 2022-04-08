import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProcessRepository } from './process.repository'
import { ProcessService } from './process.service'
import { ProcessController } from './process.controller'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [ProcessService],
  controllers: [ProcessController]
})
export class ProcessModule {}
