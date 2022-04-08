import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
  Patch,
  ForbiddenException,
  Delete
} from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { ReturnUserDto } from './dtos/return-user.dto'
import { UsersService } from './users.service'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/auth/roles.guard'
import { Role } from '../auth/role.decorator'
import { UserRole } from './user-roles.enum'
import { User } from './user.entity'
import { GetUser } from 'src/auth/get-user.decorator'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiDefaultResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger'

@ApiTags('User')
@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria usuário comum' })
  @ApiCreatedResponse({ description: 'Usuário cadastrado com sucesso' })
  @ApiUnprocessableEntityResponse({ description: 'As senhas não conferem' })
  @ApiInternalServerErrorResponse({
    description: 'Erro ao salvar o usuário no banco de dados'
  })
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createUser(createUserDto)

    return {
      user,
      message: 'Usuário cadastrado com sucesso'
    }
  }

  @Post('/adm')
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria usuário administrador' })
  @ApiCreatedResponse({ description: 'Administrador cadastrado com sucesso' })
  @ApiUnprocessableEntityResponse({ description: 'As senhas não conferem' })
  @ApiInternalServerErrorResponse({
    description: 'Erro ao salvar o usuário no banco de dados'
  })
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto)
    return {
      user,
      message: 'Administrador cadastrado com sucesso'
    }
  }

  @Get()
  @ApiOperation({ summary: 'Busca todos os usuários' })
  @ApiOkResponse({ description: 'Sucesso' })
  @ApiBearerAuth()
  @ApiDefaultResponse({ type: User })
  findAll() {
    return this.usersService.findAll()
  }

  @Get('/objectives/:id')
  @ApiOperation({
    summary: 'Busca objetivos pertencentes a usuário especificado por id'
  })
  @ApiOkResponse({ description: 'Sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não possui objetivos' })
  async findObjectiveByUser(@Param('id') id: string) {
    return await this.usersService.findObjectiveByUser(id)
  }

  @Get('/key_results/:id')
  @ApiOperation({
    summary:
      'Busca resultados-chaves pertencentes a usuário especificado por id'
  })
  @ApiOkResponse({ description: 'Sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não possui resultados-chave' })
  async findKeyResultByUser(@Param('id') id: string) {
    return await this.usersService.findKeyResultByUser(id)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Busca usuário pelo id' })
  @ApiOkResponse({ description: 'Usuário encontrado' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async findOne(@Param('id') id: string): Promise<ReturnUserDto> {
    const user = await this.usersService.findOne(id)
    return {
      user,
      message: 'Usuário encontrado'
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Aplica alterações parciais dos dados' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso' })
  @ApiInternalServerErrorResponse({
    description: 'Erro ao salvar os dados no banco de dados'
  })
  @ApiForbiddenResponse({
    description: 'Você não tem autorização para acessar esse recurso'
  })
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id') id: string
  ) {
    if (user.role != UserRole.ADMIN && user.id != id)
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso'
      )
    else {
      return this.usersService.updateUser(updateUserDto, id)
    }
  }

  @Delete('/:id')
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Exclui usuário por id' })
  @ApiOkResponse({ description: 'Usuário excluído com sucesso' })
  @ApiNotFoundResponse({
    description: 'Não foi encontrado um usuário com o ID informado'
  })
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id)
    return { message: 'Usuário excluído com sucesso' }
  }
}
