import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany
} from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Objective } from 'src/process/process.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false, type: 'varchar', length: 200 })
  @ApiProperty({ description: 'E-mail do usuário' })
  email: string

  @Column({ nullable: false, type: 'varchar', length: 200 })
  @ApiProperty({ description: 'Nome ou identificação do usuário para acesso' })
  username: string

  @Column({ nullable: false })
  @ApiProperty({ description: 'Senha do usuário' })
  password: string

  @Column({ nullable: true, type: 'varchar', length: 64 })
  @ApiProperty()
  recoverToken: string

  @Column({ nullable: true })
  @ApiProperty()
  salt: string

  @Column({ nullable: true, type: 'varchar', length: 20 })
  @ApiProperty({
    enum: ['ADMIN', 'USER'],
    description: 'Papel do usuário. Nível de privilégios do utilizador'
  })
  role: string

  @Column({ nullable: false, default: true })
  @ApiProperty({ description: 'Atividade do usuário' })
  status: boolean

  @OneToMany(() => Process, process => process.client, {
    cascade: true
  })
  process: Process[]

  async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password
  }
}
