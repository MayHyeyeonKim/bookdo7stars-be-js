import sequelize from '../config/db.js';
import Category from '../models/category.js';

class CategoryService {
  async getCategories(level) {
    const categoriesHierarchy = await sequelize.query(
      `WITH RECURSIVE categories_hierarchy AS (
          SELECT id, name, parent_id, 1 AS level,
                 name::VARCHAR as route
          FROM categories
          WHERE parent_id IS NULL --최상위 관리자 선택 (CEO)

          UNION ALL

          SELECT o.id, o.name, o.parent_id, oh.level + 1,
                 oh.route || '>' || o.name as route
          FROM categories o
          JOIN categories_hierarchy oh ON o.parent_id = oh.id
      )
      SELECT id, name, parent_id, level, route 
      FROM categories_hierarchy
      WHERE level <= :level
      ORDER BY level`,
      {
        replacements: { level },
      },
    );
    let result = [];
    let categoryMap = new Map();
    for (let category of categoriesHierarchy[0]) {
      if (category.level === 1) continue;
      if (category.level === 2) {
        category.children = [];
        categoryMap.set(category.id, { children: category.children, id: category.id, name: category.name });
        result.push(categoryMap.get(category.id));
        continue;
      }
      categoryMap.get(category.parent_id).children.push({ id: category.id, name: category.name });
    }

    return result;
  }

  async getChildrenIds(parentId) {
    const categoriesHierarchy = await sequelize.query(
      `WITH RECURSIVE categories_hierarchy AS (
        SELECT id, parent_id
        FROM categories
        WHERE id = :parentId
        UNION ALL
        SELECT o.id, o.parent_id
        FROM categories o
        JOIN categories_hierarchy oh ON o.parent_id = oh.id
      )
      SELECT id FROM categories_hierarchy`,
      {
        replacements: { parentId },
      },
    );

    let result = [];
    for (let category of categoriesHierarchy[0]) {
      result.push(category.id);
    }
    return result;
  }
  async getCategoriesById(id) {
    const categoriesHierarchy = await sequelize.query(
      `WITH RECURSIVE categories_hierarchy AS (SELECT id, name, parent_id, 
      (SELECT COUNT(*) FROM categories b WHERE b.parent_id = a.id) AS count
      FROM categories a
      WHERE id = :id

      UNION ALL

      SELECT
        c.id,
        c.name,
        c.parent_id,
        (SELECT COUNT(*) FROM categories b WHERE b.parent_id = c.id) AS count
      FROM categories c
      JOIN categories_hierarchy ch ON c.id = ch.parent_id
      WHERE c.parent_id IS NOT NULL
    )
      SELECT id, name, parent_id, count
      FROM categories_hierarchy`,
      {
        replacements: { id },
      },
    );
    let result = [];
    for (let category of categoriesHierarchy[0]) {
      result.push(category.id);
    }
    let categories = new Map();
    for (let i = result.length - 1; i >= 0; i--) {
      categories.set(result[i], await this.getChildrenCategories(result[i]));
    }
    return categories;
  }

  async getChildrenCategories(id) {
    const categories = await sequelize.query(
      `SELECT id, name, parent_id,
      (SELECT count(*) FROM categories b WHERE b.parent_id = a.id) as count
      FROM categories a
      WHERE parent_id = :id;
      `,
      {
        replacements: { id },
      },
    );
    const result = [];
    for (let category of categories[0]) {
      result.push(category);
    }

    return result;
  }

  async getCategoryById(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
}

export default new CategoryService();
