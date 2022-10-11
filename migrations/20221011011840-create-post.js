"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Posts", {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,

        references: {
          // 관계를 맺는다.
          model: "Users", // Users 테이블의
          key: "userId", // userId 컬럼과
        },
        onDelete: "cascade",
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      totalLike: {
        type: Sequelize.DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Posts");
  },
};
