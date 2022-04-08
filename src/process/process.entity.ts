import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm'
import { User } from 'src/users/user.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
@Unique(['numberOfProcess'])
export class Process extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @JoinColumn({ name: 'client_id' })
  @ManyToOne(() => User, client => client.process, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  client: User

  @Column({ nullable: false, type: 'varchar', length: 120 })
  @ApiProperty({ description: 'Especificar o número do processo' })
  numberOfProcess: string

  @Column({ nullable: false, type: 'varchar', length: 50 })
  @ApiProperty({ description: 'Sistema' })
  system: string

  @Column({ nullable: false, type: 'varchar', length: 50 })
  @ApiProperty({ description: 'Comarca' })
  comarca: string

  @Column({ nullable: false, type: 'varchar', length: 50 })
  @ApiProperty({ description: 'Vara' })
  vara: string

  @Column({ nullable: false, type: 'varchar', length: 100 })
  @ApiProperty({ description: 'Data inicial' })
  initialDate: string

  @Column({ nullable: false, type: 'varchar', length: 50 })
  @ApiProperty({ description: 'Tipo de processo' })
  type: string

  @Column({ nullable: false, type: 'varchar', length: 50 })
  @ApiProperty({ description: 'Advogado responsável' })
  lawyer: string

  @Column({ nullable: false, type: 'varchar', length: 120 })
  @ApiProperty({ description: 'Atualização' })
  update: string

  @Column({ nullable: false, type: 'varchar', length: 120 })
  @ApiProperty({ description: 'Penúltima atualização' })
  lastUpdate: string

  @CreateDateColumn()
  createdAt: Date
}
