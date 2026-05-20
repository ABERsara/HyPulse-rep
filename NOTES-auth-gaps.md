# Auth Gaps Notes

## 1. איפה אפשר להמר
- `GameScreen.js`, שורה 843 — פונקציה `handleBet` שולחת POST ל-`/api/user-answers/submit` עם questionId, selectedOptionId ו-wager
- `GameScreen.js`, שורה 884 — כפתורי ההימור (TouchableOpacity) שקוראים ל-handleBet בלחיצה

## 2. כפתורים שיצטרכו בדיקת הרשאה
- כפתור הימור על תשובה — `GameScreen.js` שורה 884 (BettingSection)
- כפתור "Close question & distribute rewards" — `GameScreen.js` שורה 763 (ResolveQuestionSection)
- כפתורי בחירת מנצח — `GameScreen.js` שורה 741 (ResolveQuestionSection)
- כפתור "Send gift" — `GameScreen.js` שורה 1029 (SendGiftSection)
- כפתור "Start watching" — `viewer_test.js` שורה 88 (ViewerTestScreen)

## 3. האם קיימת כבר בדיקת התחברות
לא.

- `GameScreen.js` — קיימת פונקציה `getAuthHeaders` (שורה 20) שמצרפת טוקן לבקשות, אך אין בדיקה אם המשתמש אכן מחובר לפני ביצוע פעולות (המרה, resolve, gift)
- `viewer_test.js` — אין ייבוא של authService בכלל. כפתור "Start watching" נגיש לכל משתמש ללא בדיקה
- `gameStreamSlice.js` — ה-role (HOST/PLAYER/VIEWER) מגיע מ-action.payload ללא אימות בצד הלקוח