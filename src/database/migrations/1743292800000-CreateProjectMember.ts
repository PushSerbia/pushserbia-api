import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectMember1743292800000 implements MigrationInterface {
  name = 'CreateProjectMember1743292800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "project_member" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "projectId" uuid NOT NULL,
        "assignedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_project_member_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_project_member_user_project" UNIQUE ("userId", "projectId")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_project_member_userId" ON "project_member" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_project_member_projectId" ON "project_member" ("projectId")
    `);

    await queryRunner.query(`
      ALTER TABLE "project_member"
        ADD CONSTRAINT "FK_project_member_userId"
        FOREIGN KEY ("userId") REFERENCES "user"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "project_member"
        ADD CONSTRAINT "FK_project_member_projectId"
        FOREIGN KEY ("projectId") REFERENCES "project"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_member" DROP CONSTRAINT "FK_project_member_projectId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_member" DROP CONSTRAINT "FK_project_member_userId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_project_member_projectId"`);
    await queryRunner.query(`DROP INDEX "IDX_project_member_userId"`);
    await queryRunner.query(`DROP TABLE "project_member"`);
  }
}
