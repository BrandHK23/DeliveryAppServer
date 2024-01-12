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
  // Primero, obtén el id_business basado en el id_user
  const sqlGetBusinessId = `
    SELECT id_business
    FROM business
    WHERE id_user = $1
  `;

  db.oneOrNone(sqlGetBusinessId, [userId])
    .then((business) => {
      // Ahora, inserta la nueva categoría con el id_business obtenido
      const sqlCreateCategory = `
      INSERT INTO 
        categories(
          name,
          description,
          id_business, 
          created_at,
          updated_at
        )
      VALUES($1, $2, $3, $4, $5) RETURNING id
    `;
      return db.oneOrNone(sqlCreateCategory, [
        category.name,
        category.description,
        business.id_business,
        new Date(),
        new Date(),
      ]);
    })
    .catch((error) => {
      console.log("Error: ", error);
      // Manejar el error adecuadamente
    });
};

module.exports = Categorie;
