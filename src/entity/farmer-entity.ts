import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Farm } from './farm-entity';

@Entity()
@Index('ix_deleted_document', ['deleted', 'document'], { unique: true })
export class Farmer extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 14 })
    document: string;

    @Column({
        name: 'document_type',
        nullable: false,
        transformer: {
            to: (value: number) => value,
            from: (value: number) =>
                value !== null ? Number(value) : undefined,
        },
    })
    documentType: number;

    @Column({
        name: 'document_type_name',
        nullable: false,
        type: 'varchar',
        length: 10,
    })
    documentTypeName: string;

    @OneToMany(() => Farm, farm => farm.farmer, {
        cascade: true,
        lazy: false,
        nullable: true,
    })
    farms?: Farm[];
}
