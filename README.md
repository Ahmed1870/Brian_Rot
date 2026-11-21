# PBI-L41-ValuesDistinctSelectedValueHasOneValue

الدرس 41 من كورس Power BI: VALUES وDISTINCT وSELECTEDVALUE وHASONEVALUE. Remotion 4.0.250 + React + TypeScript.
1920×1080، 30 FPS، 9000 فريم (300 ثانية)، الصوت: `public/voiceover_lesson_41.mp3`، آخر 5 ثوانٍ صمت.

## التشغيل
`npm install` ثم `npm start` أو `npm run render`. الأوامر في `TERMUX_COMMANDS.txt`. الرندر على GitHub Actions: `.github/workflows/render.yml`.

## الهيكل
- `src/sync.ts`: حدود المشاهد من فواصل الصمت الحقيقية في الصوت + أزمنة جمل تقديرية (لا يوجد تفريغ نصي بالزمن).
- `src/lib/PBI.tsx`: محاكاة واجهة Power BI Desktop (Shell، Slicer، Card، BarChart).
- `src/lib/data41.ts`: النموذج + منطق السياق؛ كل النتائج المعروضة (Visible Products، Selected Product، Status، العنوان) تُحسب منه.
- `src/lib/Dax.tsx`: عرض كود DAX وكتابته حرفاً حرفاً. `src/scenes/`: المشاهد 1-8.

## الخط
المطلوب Cairo: ضع Cairo-Regular.ttf وCairo-Bold.ttf في `public/fonts/` (غير موجودين في المشروع لعدم توفر إنترنت). بدونهما يُستخدم DejaVu Sans.

## ملاحظات
- المحاكاة مرسومة وليست تسجيلاً لـ Power BI الحقيقي، والبيانات تجريبية.
- قائمة VALUES في المشهد 3 لوحة توضيحية (الدوال لا تُعرض كـ Visual مباشر)، وفي المشهد 2 عمود ProductID المتكرر مثال توضيحي منفصل عن بيانات النموذج.
