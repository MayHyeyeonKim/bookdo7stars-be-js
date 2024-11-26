import sequelize from '../config/db.js';

class CategoryService {
  async getCategories(level) {
    const categoriesHierarchy = await sequelize.query(
      `WITH RECURSICE categories_hierarchy AS (
        SELECT id, name, parent_id, 1 AS level,
                name::VARCHAT as route
        FROM categories
        WHERE parent_id IS NULL --최상위 관리자 선택 (CEO)

        UNION ALL

        SELECT o.id, o.name, o.parent_id, oh.level + 1,
                oh.route || '>' || o.name as route
        FROM categories o
        JOIN categpries_hierarchy oh ON o.parent_id = oh.id
        )
        SELECT id, name, parent_id, level, route
        FROM categories_hierarchy
        WHERE level <= :level
        ORDER BY level
        `,
      {
        replacements: { level },
      },
    );

    let categoryMap = new Map();
    for (let category of categoriesHierarchy[0]) {
      if (category.level === 1) continue;
      if (category.level === 2) {
        category.child = [];
        categoryMap.set(category.id, category);
        continue;
      }
      categoryMap.get(category.parent_id).child.push(category);
    }
    return categoryMap;
  }
}

export default new CategoryService();
