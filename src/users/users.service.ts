import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  InternalServerErrorException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './users.repository'
import { CreateUserDto } from './dtos/create-user.dto'
import { User } from './user.entity'
import { UserRole } from './user-roles.enum'
import { UpdateUserDto } from './dtos/update-user.dto'
import { FindUsersQueryDto } from './dtos/find-users-query.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem')
    } else {
      return this.userRepository.createUser(createUserDto, UserRole.USER)
    }
  }

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem')
    } else {
      return this.userRepository.createUser(createUserDto, UserRole.ADMIN)
    }
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['team']
    })
  }

  async findProcessByUser(userId: string): Promise<User[]> {
    const process = await this.userRepository.findProcessByUser(userId)

    if (!process) throw new NotFoundException('Usuário não possui processos')

    return process
  }

  async findKeyResultByUser(userId: string): Promise<User[]> {
    const keyResults = await this.userRepository.findKeyResultByUser(userId)

    if (!keyResults)
      throw new NotFoundException('Usuário não possui resultados-chave')

    return keyResults
  }

  async findUsers(
    queryDto: FindUsersQueryDto
  ): Promise<{ users: User[]; total: number }> {
    const users = await this.userRepository.findUsers(queryDto)
    return users
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId, {
      select: ['id', 'email', 'username', 'role', 'status']
    })

    if (!user) throw new NotFoundException('Usuário não encontrado')

    return user
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const user = await this.findOne(id)
    const { username, email, role, status } = updateUserDto
    user.username = username ? username : user.username
    user.email = email ? email : user.email
    user.role = role ? role : user.role
    user.status = status ? status : user.status

    try {
      await user.save()
      return user
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar os dados no banco de dados'
      )
    }
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.delete({ id: userId })
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o ID informado'
      )
    }
  }
}
