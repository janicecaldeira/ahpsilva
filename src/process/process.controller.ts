import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Delete,
  Param,
  Get,
  Patch,
  ForbiddenException,
  HttpCode
} from '@nestjs/common'
import { CreateProcessDto } from './dtos/create-process.dto'
import { ReturnProcessDto } from './dtos/return-process.dto'
import { UpdateProcessDto } from './dtos/update-process.dto'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/auth/roles.guard'
import { Role } from '../auth/role.decorator'
import { UserRole } from '../users/user-roles.enum'
import { ProcessService } from './process.service'
import { GetUser } from 'src/auth/get-user.decorator'
import { User } from 'src/users/user.entity'
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse
} from '@nestjs/swagger'

@ApiTags('Process')
@Controller('process')
@UseGuards(AuthGuard(), RolesGuard)
export class ProcessController {
  constructor(private processService: ProcessService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria processos' })
  @ApiCreatedResponse({ description: 'Processo cadastrado com sucesso' })
  @ApiInternalServerErrorResponse({
    description: 'Erro ao salvar o processo no banco de dados'
  })
  async createProcess(
    @Body(ValidationPipe) createProcessDto: CreateProcessDto
  ): Promise<ReturnProcessDto> {
    const process = await this.processService.createProcess(createProcessDto)
    return {
      process,
      message: 'Processo cadastrado com sucesso'
    }
  }

  @Get()
  @ApiOperation({ summary: 'Busca todos os processos' })
  @ApiOkResponse({ description: 'Sucesso' })
  async findAll() {
    return this.processService.findAll()
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Busca processo pelo id' })
  @ApiOkResponse({ description: 'Processo encontrado' })
  @ApiNotFoundResponse({ description: 'Processo não encontrado' })
  async findOne(@Param('id') id: string): Promise<ReturnProcessDto> {
    const process = await this.processService.findOne(id)
    return {
      process,
      message: 'Processo encontrado'
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Aplica alterações parciais dos dados' })
  @ApiOkResponse({ description: 'Processo atualizado com sucesso!' })
  @ApiForbiddenResponse({
    description: 'Você não tem autorização para acessar esse recurso'
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro ao atualizar os dados no banco de dados'
  })
  async updateProcess(
    @Body(ValidationPipe) updateProcessDto: UpdateProcessDto,
    @GetUser() user: User,
    @Param('id') id: string
  ) {
    if (user.role != UserRole.ADMIN)
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso'
      )
    else {
      return this.processService.updateProcess(updateProcessDto, id)
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deleta processo pelo id' })
  @ApiOkResponse({ description: 'Processo excluído com sucesso' })
  @ApiNotFoundResponse({
    description: 'Não foi encontrado um processo com o ID informado'
  })
  async deleteProcess(@Param('id') id: string) {
    await this.processService.deleteProcess(id)
    return { message: 'Processo excluído com sucesso' }
  }
}
