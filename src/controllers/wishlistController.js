import express from 'express';
import service from '../services/wishlistService.js';

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: The users managing API
 */

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const user = req.session?.passport?.user;
    if (!user) res.status(500).json({ message: 'Error retrieving wishlist' });

    const { page, pageSize } = req.query;
    const wishlist = await service.getWishlist(user.id, page, pageSize);
    res
      .status(201)
      .json({ count: wishlist.count, wishlist: wishlist.rows, message: 'Wishlist retrieved successfully' });
  } catch (err) {
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error retrieving wishlist' });
  }
});

router.post('/toggle', async function (req, res) {
  try {
    const user = req.session?.passport?.user;
    if (!user) {
      res.status(500).json({ message: 'Error registering wishlist' });
      return;
    }
    const bookIds = req.body.bookId;
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ message: 'bookIds must be a non-empty array' });
    }
    let wishlist = null;
    if (bookIds.length === 1) {
      wishlist = await service.toggleWishItem(user.id, bookIds[0]);
    } else {
      wishlist = service.createWishlist(user.id, bookIds);
    }

    res.status(201).json({ book_id: wishlist.book_id, message: 'Wishlist registered successfully' });
  } catch (err) {
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error registering wishlist' });
  }
});

router.post('/', async function (req, res) {
  try {
    const user = req.session?.passport?.user;
    if (!user) res.status(500).json({ message: 'Error registering wishlist' });

    const bookId = req.body.bookId;
    const wishlist = await service.createWishItem(user.id, bookId);
    res.status(201).json({ book_id: wishlist.book_id, message: 'Wishlist registered successfully' });
  } catch (err) {
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error registering wishlist' });
  }
});

router.delete('/', async function (req, res) {
  try {
    const user = req.session?.passport?.user;
    if (!user) {
      res.status(500).json({ message: 'Error registering wishlist' });
      return;
    }

    const bookIds = req.body.bookIds;
    const wishlist = await service.deleteWishlist(user.id, bookIds);
    res.status(201).json({ book_id: wishlist.book_id, message: 'Wishlist deleted successfully' });
  } catch (err) {
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error deleting wishlist' });
  }
});

export default router;
