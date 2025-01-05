import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InitialCreateTables1735519197062 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'farmer',
        columns: [
          {
            name: 'id',
            type: 'bigserial',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'date_created',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'date_updated',
            type: 'timestamp',
            isNullable: true,
            default: 'now()',
          },
          {
            name: 'deleted',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'document_type',
            type: 'integer',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'document',
            type: 'varchar',
            length: '14',
          },
          {
            name: 'document_type_name',
            type: 'varchar',
            length: '10',
          },
        ],
        foreignKeys: [],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'farm',
        columns: [
          {
            name: 'id',
            type: 'bigserial',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'date_created',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'date_updated',
            type: 'timestamp',
            isNullable: true,
            default: 'now()',
          },
          {
            name: 'deleted',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'total_area',
            type: 'numeric',
            precision: 8,
            scale: 2,
          },
          {
            name: 'total_preservation_area',
            type: 'numeric',
            precision: 8,
            scale: 2,
          },
          {
            name: 'total_cultivable_area',
            type: 'numeric',
            precision: 8,
            scale: 2,
          },
          {
            name: 'farmer_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'state',
            type: 'varchar',
            length: '40',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['farmer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'farmer',
            onDelete: 'SET NULL',
          }),
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'harvest',
        columns: [
          {
            name: 'id',
            type: 'bigserial',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'date_created',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'date_updated',
            type: 'timestamp',
            isNullable: true,
            default: 'now()',
          },
          {
            name: 'deleted',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'farm_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'culture',
            type: 'varchar',
            length: '40',
          },
          {
            name: 'year',
            type: 'varchar',
            length: '10',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['farm_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'farm',
            onDelete: 'SET NULL',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover tabelas na ordem inversa para garantir que as FK sejam removidas antes
    await queryRunner.dropTable('harvest');
    await queryRunner.dropTable('farm');
    await queryRunner.dropTable('farmer');
  }
}