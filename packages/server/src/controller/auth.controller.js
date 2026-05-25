import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');

// Named Export: export const register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'כתובת האימייל כבר קיימת במערכת' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'VIEWER',
        isActive: true,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'ההרשמה בוצעה בהצלחה',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת שרת בעת ההרשמה' });
  }
};

// Named Export: export const login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'אימייל או סיסמה שגויים' });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'החשבון שלך חסום או לא פעיל. אנא צור קשר עם התמיכה.',
      });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'אימייל או סיסמה שגויים' });
      }
    } else {
      return res
        .status(400)
        .json({ message: 'אנא התחבר באמצעות חשבון Google/Facebook' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'התחברות מוצלחת',
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת שרת בעת ההתחברות' });
  }
};

//Named Export: export const socialLogin
// קבועים מוגדרים מחוץ לפונקציה לשמירה על נקיון וקלות עדכון
const MAX_FIREBASE_TOKEN_LENGTH = 4096;

export const socialLogin = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    // הגנה 1: בדיקת קיום ותקינות טיפוס (Type Validation)
    if (!firebaseToken || typeof firebaseToken !== 'string') {
      return res.status(400).json({ message: 'נדרש Firebase token' });
    }

    // הגנה 2: מניעת מתקפות DoS ע"י הגבלת אורך הקלט בזיכרון
    if (firebaseToken.length > MAX_FIREBASE_TOKEN_LENGTH) {
      return res.status(400).json({ message: 'נדרש Firebase token' });
    }

    // --- הערות מדוייקות עבור T32 עם דגש על סינכרון עם הקוד הקיים במערכת ---
    // TODO (T32): const decoded = await admin.auth().verifyIdToken(firebaseToken)
    //              הערה ל-T32: אם אימות הטוקן נכשל, חובה לתפוס את השגיאה ולהחזיר 401 (ולא 500)
    //
    // TODO (T32): const user = await prisma.user.upsert({
    //   where: { firebaseId: decoded.uid },
    //   update: { lastActiveAt: new Date() },
    //   create: {
    //     firebaseId: decoded.uid,
    //     email: decoded.email,
    //     username: decoded.name || decoded.email.split('@')[0],
    //     role: 'VIEWER',
    //     isActive: true,
    //     walletBalance: 1000 // קריטריון T32: בונוס רישום ראשוני
    //   }
    // })
    // הערת אבטחה ל-T32: ודא שב-upsert המערכת בודקת ש-user.isActive מותר להתחברות, בדומה לקוד הקיים ב-login.
    //
    // TODO (T32): const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '30d' })
    //              הערה ל-T32: קריטריון T32 דורש תוקף של 30 יום! משתמש בקבוע שכבר מוגדר בקובץ.
    //
    // TODO (T32): return res.json({ token, user: { id: user.id, username: user.username, role: user.role } })

    // קריטריון קבלה: מחזיר 501 עם הודעה ברורה (Stub יציב)
    return res.status(501).json({ message: 'לא מומש עדיין — T32 ישלים זאת' });

  } catch (err) {
    // הגנה 3: הדפסת אובייקט השגיאה המלא לשרת לצורכי דיבאג, אך הסתרת פרטים רגישים מהלקוח
    console.error('[socialLogin] Error during execution:', err);
    return res.status(500).json({ message: 'שגיאת אימות' });
  }
};