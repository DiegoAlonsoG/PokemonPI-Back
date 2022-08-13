const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('pokemons', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    life: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageRegular: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageShiny: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdBy:{
      type: DataTypes.STRING,
      defaultValue: 'Diego',
    }
  });
};
