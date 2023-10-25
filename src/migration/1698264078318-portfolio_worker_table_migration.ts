import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class PortfolioWorkerTableMigration1698264078318 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "portfolio_worker",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "portfolio_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "worker_id",
                        type: "int",
                        isNullable: false,
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
                        columnNames: ["portfolio_id"],
                        referencedTableName: "portfolio",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["worker_id"],
                        referencedTableName: "workers",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("portfolio_worker")
    }

}

