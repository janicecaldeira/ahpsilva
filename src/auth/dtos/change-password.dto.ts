import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @IsNotEmpty({ message: "Informe uma senha" })
  @MinLength(8, { message: "A senha deve ter no mínimo 8 caracteres" })
  @MaxLength(32, { message: "A senha deve ter no máximo 32 caracteres" })
  @IsString({ message: "Informe uma senha válida" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
  })
  @ApiProperty({ description: "Senha do usuário" })
  password: string;

  @IsNotEmpty({ message: "Informe a confirmação de senha" })
  @MinLength(8, { message: "A senha deve ter no mínimo 8 caracteres" })
  @MaxLength(32, { message: "A senha deve ter no máximo 32 caracteres" })
  @IsString({ message: "Informe uma senha válida" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "A confirmação de senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
  })
  @ApiProperty({ description: "Confirmação de senha" })
  confirmationPassword: string;
}
