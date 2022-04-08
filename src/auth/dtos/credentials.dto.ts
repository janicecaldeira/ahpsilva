import { ApiProperty } from "@nestjs/swagger";

export class CredentialsDto {
  @ApiProperty({ description: "E-mail do usuário" })
  email: string;

  @ApiProperty({ description: "Senha do usuário" })
  password: string;
}
