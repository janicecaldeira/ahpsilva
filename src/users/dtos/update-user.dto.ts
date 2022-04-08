import { UserRole } from '../user-roles.enum'
import { IsString, IsEmail, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @ApiProperty({ description: 'E-mail do usuário' })
  email: string

  @IsOptional()
  @IsString({ message: 'Informe um nome de usuário válido' })
  @ApiProperty({ description: 'Nome ou identificação do usuário para acesso' })
  username: string

  @IsOptional()
  @ApiProperty({
    enum: ['ADMIN', 'USER'],
    description: 'Papel do usuário. Nível de privilégios do utilizador'
  })
  role: UserRole

  @IsOptional()
  @ApiProperty({ description: 'Atividade do usuário' })
  status: boolean
}
