---
inclusion: always
---

# โปรเจกต์: เว็บไซต์ บริษัท ศิริวัตร์เมธานินท์ กรุ๊ป จำกัด

## ข้อมูลบริษัท

| รายการ | ข้อมูล |
|--------|--------|
| ชื่อภาษาไทย | บริษัท ศิริวัตร์เมธานินท์ กรุ๊ป จำกัด |
| ชื่อภาษาอังกฤษ | Siriwatmedhanin Group Co., Ltd. |
| ที่อยู่ | 115/1 หมู่ที่ 2 ตำบลท่าแค อำเภอเมืองพัทลุง จังหวัดพัทลุง 93000 |
| เลขภาษี | 0935569001087 |
| อีเมล | contact.siriwatmedhanin@gmail.com |
| โทรศัพท์ | 091-909-8902 |

---

## โครงสร้างไฟล์

```
Web Siri/
├── index.html                        # หน้าหลัก Single Page
├── assets/
│   ├── css/
│   │   └── style.css                 # Stylesheet หลักทั้งหมด
│   ├── js/
│   │   ├── main.js                   # Navbar scroll, fade-in, counter, smooth scroll
│   │   └── i18n.js                   # ระบบแปลภาษา TH / EN / ZH
│   └── images/
│       ├── logo-smg.png              # โลโก้เก่า (สำรอง)
│       ├── logo-smg-bg1.png          # ✅ โลโก้ปัจจุบัน (Logo SMG BG1.png) — ใช้ทั้ง Navbar และ Footer
│       ├── guilloche-tile.svg        # ลาย Spirograph / Guilloche SVG (ใช้งานอยู่)
│       └── guilloche-tile.png        # PNG backup (กีโยเช่ 01.png)
└── .kiro/
    └── steering/
        └── project-knowledge.md      # ไฟล์นี้
```

---

## Mood & Tone: Minimal Luxury

| องค์ประกอบ | รายละเอียด |
|------------|------------|
| Primary Color | `#6d1f3d` Deep Burgundy |
| Primary Dark | `#4a1529` |
| Primary Light | `#8b2849` |
| Accent (Gold) | `#c9a961` Metallic Gold |
| Background | `#ffffff` / `#fafafa` |
| Font Heading | Playfair Display (Google Fonts) |
| Font Body | Prompt (Google Fonts) |

---

## โครงสร้าง Section (Single Page)

1. **Navbar** — Fixed, transparent → scrolled white, Logo วงกลมใน rounded square, Language Switcher TH/EN/ZH
2. **Hero** — Full viewport, Burgundy gradient, Guilloche SVG มุมขวา (`top: -60%, right: -15%`), hologram animation
3. **About Us** — 2 คอลัมน์, Stat counters (animate on scroll)
4. **Services** — 4 Cards: ตำรับแม่ฉวี / Sunny Grove / Future Ventures R&D / Local Empowerment
5. **Benefits** — 8 items grid 2 คอลัมน์
6. **Why Choose Us** — 3 cards
7. **Contact Process** — 3 steps + contact info cards
8. **Footer** — 4 คอลัมน์, Guilloche SVG background, Burgundy dark

---

## 4 กลุ่มธุรกิจหลัก

| กลุ่ม | แบรนด์ | รายละเอียด |
|-------|--------|------------|
| อาหารท้องถิ่น | ตำรับแม่ฉวี | อาหารใต้ดั้งเดิม เช่น เต้าคั่ว |
| เกษตรพรีเมียม | Sunny Grove | อะโวคาโด 034/Hass, ลูกพลับแห้ง, รากบัว |
| วิจัยและพัฒนา | Future Ventures | ผงบีทรูทสกัด, Micro-winery |
| สนับสนุนชุมชน | Local Empowerment | รับซื้อมังคุด, สับปะรด จากเกษตรกรพัทลุง |

---

## ระบบ i18n (3 ภาษา)

- ไฟล์: `assets/js/i18n.js`
- ภาษา: **TH** (ไทย) / **EN** (English) / **ZH** (中文)
- วิธีการ: `data-i18n="key"` บน element → `innerHTML` replace
- บันทึกภาษาที่เลือกใน `localStorage` key: `smg-lang`
- Language Switcher: SVG Flag inline (🇹🇭 🇬🇧 🇨🇳) + pill capsule UI
- บน Mobile: Switcher ลอยมุมขวาล่าง `position: fixed`

---

## Logo

| รายการ | รายละเอียด |
|--------|------------|
| ไฟล์ปัจจุบัน | `assets/images/logo-smg-bg1.png` |
| ตำแหน่ง 1 | Navbar — กรอบ rounded square 52px, ไม่มี padding, รูปเต็มกรอบ |
| ตำแหน่ง 2 | Footer — กรอบ rounded square 44px, ไม่มี padding, รูปเต็มกรอบ |
| สไตล์ | `border-radius: 14px`, `object-fit: cover`, `background: transparent` |

---

## Guilloche / Spirograph Background

- ไฟล์: `assets/images/guilloche-tile.svg`
- ลาย: Spirograph กลีบดอกใหญ่ 5 ชั้น + วงกลมใหญ่กลาง + เส้นรัศมี + ดาวกลาง
- Stroke ใช้ gradient iridescent 3 แบบ (ชมพู/ทอง/เขียว/ฟ้า/ม่วง)
- **Hero**: `top: -60%, right: -15%`, ขนาด `150vh`, `mix-blend-mode: screen`, `opacity: 0.22`, `saturate(0.3)`
- **Footer**: `top: 50%, right: -5%`, ขนาด `120vh`, `opacity: 0.16`
- Animation: `guillocheHolo` — `hue-rotate` + `brightness` วนช้าๆ

---

## JavaScript Features (main.js)

| Feature | รายละเอียด |
|---------|------------|
| Navbar scroll | transparent → white เมื่อ scroll > 60px |
| Mobile menu | Hamburger + overlay + lock body scroll |
| Active nav link | Highlight ตาม section ที่กำลัง scroll |
| Fade-in | IntersectionObserver บน cards/items ทุกตัว |
| Counter animation | `.stat__number` animate ease-out cubic |
| Smooth scroll | anchor links พร้อม navbar offset |

---

## CSS Architecture

- CSS Variables ทั้งหมดอยู่ใน `:root`
- BEM naming: `.navbar__inner`, `.service-card__title` ฯลฯ
- Responsive breakpoints: `1024px` (tablet), `768px` (mobile), `480px` (small)
- `mix-blend-mode: screen` สำหรับ Guilloche overlay
- Gold metallic ใช้ `background-clip: text` gradient

---

## สิ่งที่ยังต้องเติม

- [ ] เบอร์โทรศัพท์หลัก
- [ ] อีเมลจริงหลังจดโดเมน
- [ ] รูปภาพจริง (ผลิตภัณฑ์, ทีมงาน, สำนักงาน)
- [ ] Section ลูกค้าของเรา (โลโก้พาร์ทเนอร์)
- [ ] SEO meta tags เพิ่มเติม
- [ ] Deploy บน hosting

---

## Responsive Mobile — สิ่งที่แก้แล้ว

| # | จุด | วิธีแก้ |
|---|-----|---------|
| 1 | Lang Switcher ทับ content | `position: fixed` ลอยมุมขวาล่าง + `body padding-bottom: 80px` |
| 2 | About Badge ยื่นออกนอก | เปลี่ยนเป็น `position: relative` บน mobile |
| 3 | Navbar menu scroll | เพิ่ม `overflow-y: auto` บน mobile slide-in panel |
| 4 | Hero padding ใหญ่เกิน | ลดเป็น `padding: 96px 20px 60px` บน mobile |
| 5 | aria-expanded ขาด | เพิ่ม `aria-expanded="false"` ใน HTML ตั้งแต่แรก |
| 6 | Touch targets / font | ทุก link/ปุ่ม min-height 44px, font-size เหมาะมือถือ |
| + | Hamburger animation | animate เป็น ✕ เมื่อเปิดเมนู via `.navbar__toggle.active` |

**Breakpoints:**
- `≤1024px` — services/footer grid 2 คอลัมน์
- `≤768px` — mobile layout ทั้งหมด, hamburger แสดง, lang-switcher floating
- `≤480px` — extra small, padding ลดอีก, ซ่อน `.logo-text--en`

**ทดสอบ Mobile บน Browser:**
1. เปิด `index.html` → กด **F12**
2. กด **Ctrl+Shift+M** เพื่อ Toggle Device Toolbar
3. เลือก iPhone 12 Pro (390px) หรือ Pixel 5 (393px)

---

## Typography — การใช้ Font

| Font | ใช้กับ | Weight |
|------|--------|--------|
| **Kanit** | ตัวเลขทุกจุด, Hero title, Section titles | 700, 800 |
| **Playfair Display** | Heading บทความ, italic subtitle | 400, 600, 700 |
| **Prompt** | Body text ทั่วไป | 300, 400, 500, 600 |
| **Sarabun** | Fallback Thai | 300–600 |

**จุดที่ใช้ Kanit:**
- `.stat__number` — 4, 3, 100% (About section)
- `.why-card__number` — 01, 02, 03 (Why Choose Us)
- `.section__title` — หัวข้อ section ทุกอัน
- `.hero__title` — ชื่อบริษัทใน Hero

---

## ชื่อบริษัท — การแสดงผล

| ตำแหน่ง | ข้อความ |
|---------|---------|
| Navbar logo (th) | บริษัท ศิริวัตร์เมธานินท์ กรุ๊ป จำกัด |
| Navbar logo (en) | Siriwatmedhanin Group Co., Ltd. |
| Hero title | บริษัท ศิริวัตร์เมธานินท์ กรุ๊ป จำกัด |
| Footer logo | บริษัท ศิริวัตร์เมธานินท์ กรุ๊ป จำกัด |
| Why section title | เลือก บริษัท ศิริวัตร์เมธานินท์ กรุ๊ป จำกัด ดีอย่างไร? |

**Hero title CSS:** `white-space: nowrap` บน desktop (>900px) ป้องกันตกบรรทัด, `font-size: clamp(1.4rem, 3.2vw, 2.8rem)`

---

## Typography — อัปเดตล่าสุด

| Font | ใช้กับ | หมายเหตุ |
|------|--------|----------|
| **Montserrat** | ข้อความภาษาอังกฤษทั้งหมด | Apply ผ่าน `[lang="en"]` selector |
| **Kanit** | ตัวเลข, Hero title (TH/ZH), Section titles | Weight 700–800 |
| **Playfair Display** | Heading serif, italic subtitle | Weight 400–800 |
| **Prompt** | Body text ภาษาไทย | Weight 300–700 |
| **Sarabun** | Fallback Thai | Weight 300–600 |

**Montserrat apply อัตโนมัติเมื่อกด EN:**
- i18n.js เปลี่ยน `<html lang="en">` → CSS `[lang="en"]` selector kick in
- ครอบคลุม: navbar links, hero, section titles, cards, benefits, why cards, steps, contact, footer ทุกจุด
- Always-on (ทุกภาษา): `.logo-text--en`, `.footer__logo-en`, `.hero__subtitle`, `.service-card__badge`, `.why-card__number`

---

## i18n — Coverage สมบูรณ์

ทุก section แปลครบ 3 ภาษา (TH/EN/ZH):
- Navbar, Hero, About (ที่อยู่, badge, stats)
- Services (4 cards — badge, title, desc, list items)
- Benefits (8 items — title + desc)
- Why Us (3 cards — title + desc)
- Contact (3 steps + 4 info card labels)
- Footer (tagline, columns headers, biz links, menu links, addr, tax label, copyright)

---

## ข้อมูลติดต่อ — อัปเดตล่าสุด

| รายการ | ข้อมูล |
|--------|--------|
| โทรศัพท์ | 091-909-8902 |
| อีเมล | contact.siriwatmedhanin@gmail.com |

**จุดที่แสดงข้อมูลติดต่อ:**
- Contact section — card โทรศัพท์ และ card อีเมล
- Footer — คอลัมน์ติดต่อ (ที่อยู่ + เบอร์ + อีเมล + เลขภาษี)

---

## ชื่อบริษัท EN — อัปเดตล่าสุด

ชื่อภาษาอังกฤษทุกจุดเปลี่ยนเป็น **SIRIWATMEDHANIN CO., LTD.** (ตัวพิมพ์ใหญ่ทั้งหมด)

---

## Executive Team — About Us Section

| | คนที่ 1 | คนที่ 2 |
|--|---------|---------|
| ชื่อไทย | คุณณัฐชาธรณ์ ศิริวัตร์เมธานินท์ | คุณวิไลลักษณ์ เพชรคง |
| ชื่อ EN | Mr. Natchathon Sirivaddhamedhanin | Ms. Wilailuk Phetkong |
| ตำแหน่ง | Founder & Director | Co-Founder & Heritage Director |
| ด้าน | บริหาร · นวัตกรรม · ยุทธศาสตร์ | สืบสานภูมิปัญญา · มรดกอาหาร |

CSS class: `.exec-team`, `.exec-card` — วางใน About section ต่อจาก `.about__grid`
กรอบรูป: placeholder รอใส่รูปจริง (`.exec-card__portrait-placeholder`)

---

## Floating Contact Bar

- ลอยขวากึ่งกลางหน้าจอ `position: fixed; right: 20px; bottom: 50%`
- แสดงตลอด ไม่มี toggle
- ช่องทาง: 📞 Phone → `tel:0919098902`, 📧 Email, 🔵 Facebook เพจบริษัท, 💬 Messenger
- LINE: comment ไว้ในโค้ด รอ uncomment เมื่อมี ID
- Mobile: เลื่อนลงมา `bottom: 80px` ไม่ทับ lang switcher

---

## Shop Buttons — ปุ่มสั่งซื้อ

**Design:** Outline สีทอง (`border-color: var(--color-accent)`), hover → fill ทอง

| Platform | Icon | CSS Class |
|----------|------|-----------|
| Shopee | SVG กระเป๋าช้อป | `.shop-btn--shopee` |
| TikTok Shop | `fab fa-tiktok` | `.shop-btn--tiktok` |
| Thaimart | SVG ช้าง (โลโก้ Thaimart) | `.shop-btn--thaimart` |
| Facebook Shop | `fab fa-facebook-f` | `.shop-btn--fb-shop` / `.shop-btn--fb` |

**ปรากฏใน 2 จุด:**
1. การ์ด Services — ตำรับแม่ฉวี (Shopee + TikTok + Thaimart + FB), Sunny Grove (TikTok)
2. Contact section — กล่อง "ช่องทางการสั่งซื้อออนไลน์" (`.shop-online-box`)

**Links:**
- ตำรับแม่ฉวี Shopee: `https://th.shp.ee/hs9fjhg1`
- ตำรับแม่ฉวี TikTok: `https://vt.tiktok.com/ZSbGe5XCX/?page=TikTokShop`
- ตำรับแม่ฉวี Thaimart: `https://thaimart.com/s/ตำรับแม่ฉวี-เต้าคั่วท่าแค-0YqHGk`
- ตำรับแม่ฉวี Facebook: `https://www.facebook.com/share/19nQqpkRvB/?mibextid=wwXIfr`
- Sunny Grove TikTok: `https://vt.tiktok.com/ZSbGeqS6s/?page=TikTokShop`
- บริษัท Facebook (เพจหลัก): `https://www.facebook.com/share/1FGMbjt1ME/?mibextid=wwXIfr`

---

## ข้อมูลติดต่อ — สมบูรณ์

| ช่องทาง | ข้อมูล |
|---------|--------|
| โทรศัพท์ | 091-909-8902 |
| อีเมล | contact.siriwatmedhanin@gmail.com |
| Facebook เพจหลัก | https://www.facebook.com/share/1FGMbjt1ME/ |
| LINE | (รอเพิ่มภายหลัง — comment ไว้ใน floating bar) |
