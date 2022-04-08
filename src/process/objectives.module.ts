import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ObjectiveRepository } from "./objectives.repository";
import { ObjectivesService } from "./objectives.service";
import { ObjectivesController } from "./objectives.controller";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjectiveRepository]),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [ObjectivesService],
  controllers: [ObjectivesController],
})
export class ObjectivesModule {}
