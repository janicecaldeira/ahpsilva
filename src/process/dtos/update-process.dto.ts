import { IsOptional } from 'class-validator'
import { User } from 'src/users/user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProcessDto {
  @IsOptional()
  @ApiProperty({ description: 'Cliente do processo' })
  client: User

  @IsOptional()
  @ApiProperty({ description: 'Especificar o número do processo' })
  numberOfProcess: string

  @IsOptional()
  @ApiProperty({ description: 'Sistema' })
  system: string

  @IsOptional()
  @ApiProperty({ description: 'Comarca' })
  comarca: string

  @IsOptional()
  @ApiProperty({ description: 'Vara/câmara' })
  vara: string

  @IsOptional()
  @ApiProperty({ description: 'Data inicial' })
  initialDate: string

  @IsOptional()
  @ApiProperty({ description: 'Tipo de processo' })
  type: string

  @IsOptional()
  @ApiProperty({ description: 'Advogado responsável' })
  lawyer: string
}
