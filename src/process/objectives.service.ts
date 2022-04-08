import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectiveRepository } from './objectives.repository'
import { UserRole } from '../users/user-roles.enum'
import { CreateObjectiveDto } from './dtos/create-objective.dto'
import { Objective } from './objective.entity'
import { UpdateObjectiveDto } from './dtos/update-objective.dto'

@Injectable()
export class ObjectivesService {
  constructor(
    @InjectRepository(ObjectiveRepository)
    private objectiveRepository: ObjectiveRepository
  ) {}

  async createObjective(
    createObjectiveDto: CreateObjectiveDto
  ): Promise<Objective> {
    return this.objectiveRepository.createObjective({
      createObjectiveDto,
      role: UserRole.USER
    })
  }

  async findAll(): Promise<Objective[]> {
    return Objective.find({
      order: {
        createdAt: 'ASC'
      },
      relations: ['client']
    })
  }

  async findOne(objectiveId: string): Promise<Objective> {
    const obj = await this.objectiveRepository.findOne(objectiveId, {
      relations: ['owner', 'year', 'quarter', 'team']
    })

    if (!obj) throw new NotFoundException('Objetivo não encontrado')

    return obj
  }

  async updateObjective(
    updateObjectiveDto: UpdateObjectiveDto,
    id: string
  ): Promise<Objective> {
    const obj = await this.findOne(id)
    const { numberOfProcess, type, initial_date, client } = updateObjectiveDto
    obj.numberOfProcess = numberOfProcess
      ? numberOfProcess
      : obj.numberOfProcess
    obj.type = type ? type : obj.type
    obj.initial_date = initial_date ? initial_date : obj.initial_date
    obj.client = client ? client : obj.client

    try {
      await obj.save()
      return obj
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar os dados no banco de dados'
      )
    }
  }

  async deleteObjective(objectiveId: string) {
    const result = await this.objectiveRepository.delete({ id: objectiveId })
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um objetivo com o ID informado'
      )
    }
  }
}
