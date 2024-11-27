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

//Example
// const categoriesHierarchy = [
//   [
//     { id: 1, name: "국내도서", parent_id: null, level: 1, child: []},
//     { id: 2, name: "중학교참고서", parent_id: 1, level: 2 },
//     { id: 3, name: "고등학교참고서", parent_id: 1, level: 2 },
//     { id: 4, name: "출판사별", parent_id: 2, level: 3 },
//     { id: 5, name: "마더텅", parent_id: 4, level: 4 },
//     { id: 6, name: "영문법 3800제 (중등)", parent_id: 5, level: 5 },
//   ],
// ];

export default new CategoryService();
