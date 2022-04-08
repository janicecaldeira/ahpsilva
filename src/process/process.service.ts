import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRole } from '../users/user-roles.enum'
import { CreateProcessDto } from './dtos/create-process.dto'
import { ProcessRepository } from './process.repository'
import { Process } from './process.entity'
import { UpdateProcessDto } from './dtos/update-process.dto'

@Injectable()
export class ProcessService {
  constructor(
    @InjectRepository(ProcessRepository)
    private processRepository: ProcessRepository
  ) {}

  async createProcess(createProcessDto: CreateProcessDto): Promise<Process> {
    return this.processRepository.createProcess({
      createProcessDto,
      role: UserRole.USER
    })
  }

  async findAll(): Promise<Process[]> {
    return Process.find({
      order: {
        createdAt: 'ASC'
      },
      relations: ['client']
    })
  }

  async findOne(processId: string): Promise<Process> {
    const process = await this.processRepository.findOne(processId, {
      relations: ['client']
    })

    if (!process) throw new NotFoundException('Processo não encontrado')

    return process
  }

  async updateProcess(
    updateProcessDto: UpdateProcessDto,
    id: string
  ): Promise<Process> {
    const process = await this.findOne(id)
    const {
      client,
      numberOfProcess,
      system,
      comarca,
      vara,
      initialDate,
      type,
      lawyer
    } = updateProcessDto
    process.client = client ? client : process.client
    process.numberOfProcess = numberOfProcess
      ? numberOfProcess
      : process.numberOfProcess
    process.system = system ? system : process.system
    process.comarca = comarca ? comarca : process.comarca
    process.vara = vara ? vara : process.vara
    process.type = type ? type : process.type
    process.initialDate = initialDate ? initialDate : process.initialDate
    process.lawyer = lawyer ? lawyer : process.lawyer

    try {
      await process.save()
      return process
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar os dados no banco de dados'
      )
    }
  }

  async deleteProcess(processId: string) {
    const result = await this.processRepository.delete({ id: processId })
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um processo com o ID informado'
      )
    }
  }
}
