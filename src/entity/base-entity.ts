import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export abstract class BaseEntity {
    @PrimaryGeneratedColumn({
      type: 'bigint',
    })
      id!: number;
  
    @CreateDateColumn({
      name: 'date_created',
      nullable: false,
      update: false,
      insert: true,
    })
      dateCreated?: Date;
  
    @UpdateDateColumn({
      name: 'date_updated',
      nullable: true,
      update: true,
      insert: false,
    })
    dateUpdated?: Date;

    @Column({ name: 'deleted', nullable: false, default: false, type: 'boolean' })
    deleted?: boolean;

  }
  