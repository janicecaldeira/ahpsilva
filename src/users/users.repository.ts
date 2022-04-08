import { EntityRepository, Repository } from 'typeorm'
import { User } from './user.entity'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserRole } from './user-roles.enum'
import * as bcrypt from 'bcryptjs'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { CredentialsDto } from '../auth/dtos/credentials.dto'
import { FindUsersQueryDto } from './dtos/find-users-query.dto'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole
  ): Promise<User> {
    const { email, username, password } = createUserDto

    const user = this.create()
    user.email = email
    user.username = username
    user.role = role
    user.status = true
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt)

    try {
      await user.save()
      delete user.password
      delete user.salt
      return user
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de e-mail já está em uso!')
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados'
        )
      }
    }
  }

  async findObjectiveByUser(id: string): Promise<any> {
    const query = this.createQueryBuilder('user')
    query.where('user.id = :id', { id })
    query.innerJoinAndSelect('user.objectives', 'objectives')
    query.select(['user.id', 'objectives'])
    return await query.getOne()
  }

  async findKeyResultByUser(id: string): Promise<any> {
    const query = this.createQueryBuilder('user')
    query.where('user.id = :id', { id })
    query.innerJoinAndSelect('user.key_results', 'key_results')
    query.select(['user.id', 'key_results'])
    return await query.getOne()
  }

  async findUsers(
    queryDto: FindUsersQueryDto
  ): Promise<{ users: User[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit
    queryDto.status = queryDto.status === undefined ? true : queryDto.status

    const { email, username, status, role } = queryDto
    const query = this.createQueryBuilder('user')
    query.where('user.status = :status', { status })

    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` })
    }

    if (username) {
      query.andWhere('user.username ILIKE :username', {
        username: `%${username}%`
      })
    }

    if (role) {
      query.andWhere('user.role ILIKE :role', { role })
    }

    query.skip((queryDto.page - 1) * queryDto.limit)
    query.take(queryDto.limit)
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined)
    query.select(['user.username', 'user.email', 'user.role', 'user.status'])

    const [users, total] = await query.getManyAndCount()

    return { users, total }
  }

  async changePassword(id: string, password: string) {
    const user = await this.findOne(id)
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt)
    user.recoverToken = null
    await user.save()
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto
    const user = await this.findOne({ email, status: true })
    if (user && (await user.checkPassword(password))) {
      return user
    } else {
      return null
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}
