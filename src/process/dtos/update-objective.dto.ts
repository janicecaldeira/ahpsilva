import { IsOptional } from 'class-validator'
import { User } from 'src/users/user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateObjectiveDto {
  @IsOptional()
  @ApiProperty({ description: 'Especificar objetivo' })
  numberOfProcess: string

  @IsOptional()
  @ApiProperty({ description: 'Tipo de objetivo' })
  type: string

  @IsOptional()
  @ApiProperty({ description: 'Data inicial' })
  initial_date: string

  @IsOptional()
  @ApiProperty()
  client: User
}
