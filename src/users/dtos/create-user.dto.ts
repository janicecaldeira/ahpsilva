import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsOptional
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Informe um endereço de e-mail' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @MaxLength(200, { message: 'O e-mail deve ter menos de 200 caracteres' })
  @ApiProperty({ description: 'E-mail do usuário' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Informe um nome de usuário' })
  @MaxLength(200, { message: 'O nome deve ter menos de 200 caracteres' })
  @ApiProperty({ description: 'Confirmação do e-mail do usuário' })
  username: string

  @IsNotEmpty({ message: 'Informe uma senha' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @MaxLength(32, { message: 'A senha deve ter no máximo 32 caracteres' })
  @IsString({ message: 'Informe uma senha válida' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial'
  })
  @ApiProperty({
    description:
      'Senha do usuário. Deve ter no mínimo 8 e no máximo 32 caracteres, deve conter letras maiúsculas, minúsculas, número e caracteres especiais'
  })
  password: string

  @IsNotEmpty({ message: 'Informe a confimação de senha' })
  @MinLength(8, {
    message: 'A confirmação de senha deve ter no mínimo 8 caracteres'
  })
  @MaxLength(32, {
    message: 'A confirmação de senha deve ter no máximo 32 caracteres'
  })
  @IsString({ message: 'Informe a confirmação de senha válida' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A confirmação de senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial'
  })
  @ApiProperty({ description: 'Confirmação da senha do usuário' })
  passwordConfirmation: string
}
