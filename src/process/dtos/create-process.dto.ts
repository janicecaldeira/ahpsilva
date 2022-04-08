import { IsString, IsNotEmpty } from 'class-validator'
import { User } from 'src/users/user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProcessDto {
  @IsNotEmpty({ message: 'Informe um cliente' })
  @ApiProperty({ description: 'Cliente do processo' })
  client: User

  @IsString()
  @IsNotEmpty({ message: 'Informe o número do processo' })
  @ApiProperty({ description: 'Especificar o número do processo' })
  numberOfProcess: string

  @IsString()
  @IsNotEmpty({ message: 'Informe o sistema' })
  @ApiProperty({ description: 'Sistema' })
  system: string

  @IsString()
  @IsNotEmpty({ message: 'Informa a comarca' })
  @ApiProperty({ description: 'Comarca' })
  comarca: string

  @IsString()
  @IsNotEmpty({ message: 'Informe a vara/câmara' })
  @ApiProperty({ description: 'Vara/câmara' })
  vara: string

  @IsString()
  @IsNotEmpty({ message: 'Informe uma data inicial' })
  @ApiProperty({ description: 'Data inicial' })
  initialDate: string

  @IsString()
  @IsNotEmpty({ message: 'Informe um tipo' })
  @ApiProperty({ description: 'Tipo de objetivo' })
  type: string

  @IsString()
  @IsNotEmpty({ message: 'Informe um advogado' })
  @ApiProperty({ description: 'Advogado responsável' })
  lawyer: string
}
