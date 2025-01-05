import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Harvest } from './harvest-entity';
import { Farmer } from './farmer-entity';

@Entity()
export class Farm extends BaseEntity {
    @Column({ nullable: false, type: 'varchar', length: 255 })
    name: string;

    @Column({ nullable: false, type: 'varchar', length: 100 })
    city: string;

    @Column({ nullable: false, type: 'varchar', length: 40 })
    state: string;

    @Column({
        name: 'total_area',
        nullable: false,
        type: 'decimal',
        precision: 8,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: number) =>
                value !== null ? Number(value) : undefined,
        },
    })
    totalArea?: number;

    @Column({
        name: 'total_preservation_area',
        nullable: false,
        type: 'decimal',
        precision: 8,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: number) =>
                value !== null ? Number(value) : undefined,
        },
    })
    totalPreservationArea?: number;

    @Column({
        name: 'total_cultivable_area',
        nullable: false,
        type: 'decimal',
        precision: 8,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: number) =>
                value !== null ? Number(value) : undefined,
        },
    })
    totalCultivableArea?: number;

    @OneToMany(() => Harvest, harvest => harvest.farm, {
        cascade: true,
        lazy: false,
        eager: false,
        nullable: true,
    })
    harvests?: Harvest[];

    @ManyToOne(() => Farmer, farmer => farmer.farms, { eager: false })
    @JoinColumn({ name: 'farmer_id', referencedColumnName: 'id' })
    farmer!: Farmer;
}
