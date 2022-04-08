import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { CreateProcessDto } from './dtos/create-process.dto'
import { UserRole } from '../users/user-roles.enum'
import { Process } from './process.entity'

@EntityRepository(Process)
export class ProcessRepository extends Repository<Process> {
  async createProcess({
    createProcessDto,
    role
  }: {
    createProcessDto: CreateProcessDto
    role: UserRole
  }): Promise<Process> {
    const {
      client,
      numberOfProcess,
      system,
      comarca,
      vara,
      initialDate,
      type,
      lawyer
    } = createProcessDto
    const newProcess = this.create()
    newProcess.client = client
    newProcess.numberOfProcess = numberOfProcess
    newProcess.system = system
    newProcess.comarca = comarca
    newProcess.vara = vara
    newProcess.initialDate = initialDate
    newProcess.type = type
    newProcess.lawyer = lawyer

    try {
      await newProcess.save()
      return newProcess
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Processo já cadastrado!')
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o processo no banco de dados'
        )
      }
    }
  }
}
