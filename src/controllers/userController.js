import express from 'express';
import bodyParser from 'body-parser';
import userService from '../services/userService.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 새로운 유저를 생성합니다.
 *     tags: [Creaate a user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - policyyn
 *             properties:
 *               name:
 *                 type: string
 *                 description: 유저 이름
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: 유저 이메일
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: 유저 비밀번호
 *                 example: Password123!
 *               mobile:
 *                 type: string
 *                 description: 유저 연락처
 *                 example: 010-1234-1234
 *               policyyn:
 *                 type: string
 *                 description: 정책동의여부
 *                 example: "Y"
 *               address:
 *                 type: string
 *                 description: 유저 주소
 *                 example: "123 Main St"
 *     responses:
 *       201:
 *         description: 유저가 성공적으로 생성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 생성된 유저의 ID
 *                   example: 1
 *                 message:
 *                   type: string
 *                   description: 응답 메세지
 *                   example: User registered successfully
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메세지
 *                   example: Error registering user
 */
router.post('/users', async function (req, res) {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ userId: newUser.id, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error registering user' });
  }
});

export default router;
