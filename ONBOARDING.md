# HyPulse — מסמך Onboarding לצוות הפרקטיקום

ברוכות הבאות לפרויקט! המסמך הזה נועד לתת לכן תמונה ראשונית על מה שבנינו ולאיפה הולכים.  
קראו לאט, חפרו, ושאלו.

---

## מה זה HyPulse?

HyPulse היא פלטפורמה אינטראקטיבית בזמן אמת שמשלבת **סטרימינג ווידאו** עם **משחק טריוויה עם כסף אמיתי**.

### הזרימה הבסיסית:
```
Host פותח משחק ומתחיל לשדר
        ↓
Moderator מצטרף ומנהל שאלות
        ↓
Players מצטרפים, צופים בשידור, ומהמרים מטבעות על תשובות
        ↓
Viewers צופים בלבד (ללא הימור)
        ↓
תשובה נכונה = זכייה. תשובה שגויה = הפסד.
        ↓
בסיום — חלוקת פרסים אוטומטית
```

---

## ארכיטקטורה — 4 חבילות

הפרויקט הוא **monorepo** — רפו אחד שמכיל כמה packages עצמאיים:

```
packages/
  client/        ← האפליקציה (React Native / Expo)
  server/        ← שרת (Node.js, Express, Socket.IO, Prisma, Stripe)
  media-server/  ← סטרימינג (Mediasoup WebRTC + FFmpeg → HLS)
  shared/        ← קוד משותף (schemas, socket event constants)
```

כל package מריץ בתוך **Docker container** נפרד.  
`docker-compose.yml` בשורש מאחד את הכל.

---

## טכנולוגיות מרכזיות

| טכנולוגיה | למה? |
|---|---|
| **Node.js + Express** | שרת ה-API |
| **Socket.IO** | תקשורת real-time בין שרת ל-client |
| **Prisma** | ORM — שכבה בין הקוד לבסיס הנתונים |
| **PostgreSQL** | בסיס הנתונים |
| **Mediasoup** | WebRTC — וידאו host → שרת |
| **FFmpeg** | המרת WebRTC → HLS (פורמט סטרימינג לצופים) |
| **Stripe** | תשלומים אמיתיים בכרטיס אשראי |
| **Redux** | ניהול state באפליקציה |
| **Expo / React Native** | אפליקציית מובייל |
| **Docker** | הרצת כל השירותים יחד |
| **JWT** | אוטנטיקציה — כל request חייב token |

---

## תפקידי משתמש במערכת

| תפקיד | מה עושה |
|---|---|
| **HOST** | פותח משחק, משדר ווידאו |
| **MODERATOR** | מנהל שאלות, מכריז על תשובות |
| **PLAYER** | מהמר מטבעות על תשובות |
| **VIEWER** | צופה בלבד — אין הימורים |

---

## מטבעות ומשק הכסף

- המטבע הוא **COIN** (1 coin = 1 ₪ בקנייה)
- קנייה ראשונה — בונוס x2
- בכל שאלה: player בוחר תשובה ומהמר כמות coins
- חלוקת פרסים אוטומטית בסיום שאלה:
  - **STANDARD**: חלוקה יחסית בין מענה נכון + בונוס 125%
  - **WINNER_TAKES_ALL**: מנצח אחד לוקח 85% מהסיר

---

## קבצים חשובים לדעת איפה הם

| קובץ | נמצא ב |
|---|---|
| סכמת DB (כל המודלים) | `packages/server/prisma/schema.prisma` |
| כל ה-routes | `packages/server/src/routes/` |
| לוגיקת משחק | `packages/server/src/services/game.service.js` |
| לוגיקת כסף | `packages/server/src/services/economy.service.js` |
| socket events (server) | `packages/server/src/sockets/game.handler.js` |
| socket events (media) | `packages/media-server/src/sockets/stream.handler.js` |
| קבועי socket משותפים | `packages/shared/src/socketEvents.js` |
| ניהול WebRTC ב-client | `packages/client/src/services/MediasoupManager.js` |
| Redux state | `packages/client/src/store/slices/` |
| מסכי האפליקציה | `packages/client/src/screens/` |

---

## מה עוד לא גמור (וזה חלק מהעבודה שלכן)

- מסכי האפליקציה בנויים בצורה חלקית — הלוגיקה קיימת, ה-UI דורש עבודה
- flow ה-Moderator הוא אחד הדברים שדורש השלמה
- טסטים — כמעט אין
- UX / design — בפיגמה

---

## הוראות להרצה מקומית (אם תרצו לנסות)

```bash
# 1. שכפלו את הרפו
git clone <repo-url>
cd World-Play-Backend

# 2. צרו קובץ .env בשורש (בקשו פרטים מסרה)
# 3. הריצו את כל השירותים
docker-compose up --build -d

# 4. בדקו שהשרת עובד
curl http://localhost:8080/api/status

# 5. פתחו את Prisma Studio לראות את הDB
http://localhost:5557
```

---

## לפני שמתחילים לקרוא קוד — שאלות כלליות לחשוב עליהן

1. איך player מצטרף למשחק? מה קורה ב-backend כשהוא לוחץ "הצטרף"?
2. מי שולח ומי מקבל ב-Socket.IO?
3. אם player מנתק באמצע — מה קורה למטבעות שלו?
4. איך הווידאו של ה-Host מגיע לצופים?
5. מה ההבדל בין REST endpoint לבין socket event? מתי משתמשים בכל אחד?

---

*המסמך הזה נכתב עם תחילת הפרקטיקום — מאי 2026.*  
*שאלות? פנו לסרה.*
