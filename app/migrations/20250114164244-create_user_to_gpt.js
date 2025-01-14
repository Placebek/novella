'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('UserToGpts', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true,
          },
          variant: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          parent_id: {
              type: Sequelize.INTEGER,
              allowNull: true,
              references: {
                  model: 'UserToGpts', // Самоотношение
                  key: 'id',
              },
              onDelete: 'SET NULL',
              onUpdate: 'CASCADE',
          },
          request_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'Requests',
                  key: 'id',
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
          },
          variants: {
              type: Sequelize.JSON,
              allowNull: true,
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW,
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW,
          },
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('UserToGpts');
  },
};
