import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Farm } from './farm-entity';

@Entity()
export class Harvest extends BaseEntity {
    @Column({ type: 'varchar', length: 40 })
    culture: string;

    @Column({ type: 'varchar', length: 10 })
    year: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @ManyToOne(() => Farm, farm => farm.harvests)
    @JoinColumn({ name: 'farm_id', referencedColumnName: 'id' })
    farm!: Farm;
}
