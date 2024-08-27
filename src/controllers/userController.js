import express from 'express';
import bodyParser from 'body-parser';
import userService from '../services/userService.js';
import session from 'express-session';
import passport from '../passport/oauth.js';
import dotenv from 'dotenv';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

const router = express.Router();
dotenv.config();
router.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // HTTPS를 사용하면 true로 설정
      httpOnly: true,
      sameSite: 'Lax', // 다른 도메인 간 쿠키 전송을 허용하려면 'none'으로 설정
    },
  }),
);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(passport.initialize());
router.use(passport.session());

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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 유저를 로그인시킵니다.
 *     tags: [sign in a user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: 유저 이메일
 *                 example: john.123doe@example.com
 *               password:
 *                 type: string
 *                 description: 유저 비밀번호
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: 로그인 성공했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: 유저의 이름
 *                   example: John Doe
 *                 grade:
 *                   type: string
 *                   description: 회원 등급
 *                   example: Bronze
 *       401:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메세지
 *                   example: User not found or Incorrect Password
 */

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      return res.status(200).json(user);
    });
  })(req, res);
});

/*
// 세션에 사용자 정보를 저장
passport.serializeUser((user, done) => {
  done(null, user);
});

// 세션에서 사용자 정보를 복구
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  'github',
  new OAuth2Strategy(
    {
      authorizationURL: 'https://github.com/login/oauth/authorize',
      tokenURL: 'https://github.com/login/oauth/access_token',
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // 여기에서 사용자 정보 확인 및 저장
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);

      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(emailResponse);
      response.data.email = emailResponse.data[0].email;

      return done(null, response.data);
    },
  ),
);*/

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureMessage: { message: 'fault' }, successMessage: { message: 'success' } }),
  async (req, res) => {
    const user = await userService.findUserByEmail(req.session.passport.user);
    if (!user) {
      const newUser = {
        email: req.session.passport.user.email,
        password: Math.random().toFixed(5).toString(),
        name: req.session.passport.user.login,
      };
      await userService.createUser(newUser);
    }

    res.status(201).json(req.session.passport.user);
  },
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureMessage: { message: 'fault' }, successMessage: { message: 'success' } }),
  async (req, res) => {
    const user = await userService.findUserByEmail(req.session.passport.user);
    if (!user) {
      const newUser = {
        email: req.session.passport.user.email,
        password: Math.random().toFixed(5).toString(),
        name: req.session.passport.user.login,
      };
      await userService.createUser(newUser);
    }

    res.status(201).json(req.session.passport.user);
  },
);

router.get('/session', async function (req, res) {
  try {
    const user = await userService.findUserByEmail(req.session.passport.user);
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error logging in user', err.message);
  }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 유저를 로그아웃시킵니다.
 *     tags: [sign out a user]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: 로그아웃 성공했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 로그아웃 성공 메시지
 *                   example: Logout successful
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 로그 아웃 오류 메세지
 *                   example: Error logging out
 */

router.post('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logout successful' });
    });
  });
});

export default router;
