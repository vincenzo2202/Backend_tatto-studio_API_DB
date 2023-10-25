import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class WorkersTableMigration1698263348343 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "workers",
                columns: [
                    {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "hours_worked",
                    type: "int",
                    default: 0
                },
                {
                    name: "user_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                }
            ]
        }),
        true
    );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("workers")
    }

}
