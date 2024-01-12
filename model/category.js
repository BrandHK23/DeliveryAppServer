const db = require("../config/config");

const Categorie = {};

Categorie.getByUserId = (userId) => {
  const sql = `
    SELECT
      c.id,
      c.name,
      c.description,
      c.id_business
    FROM
      categories c
    INNER JOIN business b ON c.id_business = b.id_business
    WHERE b.id_user = $1
    ORDER BY
      c.name
  `;

  return db.manyOrNone(sql, [userId]);
};

Categorie.create = (category, userId) => {
  const sqlGetBusinessId = `
    SELECT id_business
    FROM business
    WHERE id_user = $1
  `;

  // Retorna la promesa al nivel superior
  return db.oneOrNone(sqlGetBusinessId, [userId]).then((business) => {
    if (!business || !business.id_business) {
      throw new Error("Negocio no encontrado para este usuario");
    }
    const sqlCreateCategory = `
        INSERT INTO 
          categories(name, description, id_business, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5) RETURNING id
      `;
    return db.one(sqlCreateCategory, [
      category.name,
      category.description,
      business.id_business,
      new Date(),
      new Date(),
    ]);
  });
};

module.exports = Categorie;
