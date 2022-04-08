import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { UserRepository } from "src/users/users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { CredentialsDto } from "../auth/dtos/credentials.dto";
import { User } from "../users/user.entity";
import { UserRole } from "src/users/user-roles.enum";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { ChangePasswordDto } from "../auth/dtos/change-password.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException("As senhas não conferem");
    } else {
      const user = await this.userRepository.createUser(
        createUserDto,
        UserRole.USER
      );
      return user;
    }
  }

  async signin(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.checkCredentials(credentialsDto);
    if (user === null) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const userId = user.id;

    const jwtPayload = {
      id: user.id,
    };
    const token = await this.jwtService.sign(jwtPayload);
    return { token, userId };
  }

  async recoverToken(id: string): Promise<any> {
    const user = await this.userRepository.findOne({ id });
    if (!user) throw new NotFoundException("Usuário não encontrado");
    user.recoverToken = randomBytes(32).toString("hex");
    await user.save();

    const recover = await this.userRepository.findOne(
      { id },
      { select: ["recoverToken"] }
    );
    return { recover };
  }

  async resetPassword(
    recoverToken: string,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.userRepository.findOne(
      { recoverToken },
      { select: ["id"] }
    );
    if (!user) {
      throw new NotFoundException("Token inválido");
    }

    try {
      await this.changePassword(user.id.toString(), changePasswordDto);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    id: string,
    changePassworDto: ChangePasswordDto
  ): Promise<void> {
    const { password, confirmationPassword } = changePassworDto;

    if (password != confirmationPassword) {
      throw new UnprocessableEntityException("As senhas não conferem");
    }

    await this.userRepository.changePassword(id, password);
  }
}
