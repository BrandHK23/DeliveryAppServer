const db = require("../config/config");

const Business = {};

Business.getBusinessByUserId = (id_user) => {
  // Asegúrate de pasar el id_user como argumento
  const sql = `
    SELECT b.*
    FROM business b
    JOIN users u ON b.id_user = u.id
    WHERE u.id = $1;
  `;
  return db.manyOrNone(sql, [id_user]);
  // Utiliza el id_user como parámetro en la consulta SQL
};

Business.getAll = () => {
  const sql = `SELECT * FROM business`;

  return db.manyOrNone(sql);
};

Business.create = async (business) => {
  return db.tx(async (t) => {
    const createdBusiness = await t.one(
      `
      INSERT INTO
        business(
          business_name,
          email,
          phone,
          logo,  
          is_available,
          is_active,
          id_user,
          created_at,
          updated_at
        )
      VALUES($1, $2, $3, $4, false, false, $5, $6, $7)
      RETURNING id_business
    `,
      [
        business.business_name,
        business.email,
        business.phone,
        business.logo,
        business.id_user,
        new Date(),
        new Date(),
      ]
    );

    await t.none(
      `
      UPDATE users
      SET user_has_business = true
      WHERE id = $1
    `,
      [business.id_user]
    );

    return createdBusiness;
  });
};

module.exports = Business;