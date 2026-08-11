const AppStyles = () => (
  <style>{`
    /* Mobile styles */
    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .md-hidden { display: inline-block !important; }
      
      .hero-br-line3 { display: none; }
      
      .header .container {
        gap: 8px;
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      
      .header .container > div:first-child {
        flex: 0 0 auto !important;
      }
      
      .header .container > div:last-child {
        flex: 0 0 auto !important;
        gap: 6px !important;
      }
    }

    .hero-section {
      width: 100%;
      margin: 0;
      min-height: 90vh;
      padding-top: 120px;
      padding-bottom: 120px;
      position: relative;
      display: flex;
      align-items: center;
    }
      .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
            background-image: url('/images/hero_bg_daruzen.webp');
      background-repeat: no-repeat;
      background-size: 111% auto;
      background-position: center 75%;
    }
        html[lang="ar"] .hero-section::before {
      background-image: url('/images/hero_bg_daruzen_ar.webp');
            background-color: #5a4a3f;
      background-size: 111% auto;
      background-position: 0% 60%;
      transform: none;
    }
    .hero-section::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 32%, transparent 55%);
    }
    html[lang="ar"] .hero-section::after {
      background: linear-gradient(to left, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 32%, transparent 55%);
    }
      html[lang="ar"] .hero-content-wrapper {
        max-width: none;
        padding: 0;
      }
      html[lang="ar"] .hero-text-container {
        margin-left: 0;
        margin-right: 0;
      }
      @media (min-width: 779px) {
        html[lang="ar"] .hero-text-container {
          margin-right: 12%;
        }
      }
    @media (max-width: 778px) {
      .hero-section,
      .marquee-section,
      #catalog,
      #about,
      #contacts,
      footer {
        overflow: hidden;
      }

html[lang="ar"] .hero-section::before {
      background-color: #5a4a3f;
      background-size: cover;
      background-position: center center;
    }
html[lang="ar"] .hero-section::after {
                        background: linear-gradient(270deg, rgba(255,255,255,0.5) 0%, transparent 35%) !important;
    }
      .header {
        width: 100% !important;
        margin-left: 0 !important;
        left: 0 !important;
        right: 0 !important;
      }

      .hero-text-container,
      #catalog .container,
      #about .container,
      #contacts .container,
      footer .container,
      .category-filter {
        padding-left: 20px !important;
        padding-right: 20px !important;
        width: 100% !important;
        max-width: none !important;
      }

      footer .container {
        padding-left: 20px !important;
      }

      footer .container > div {
        grid-template-columns: 1fr 1fr !important;
        gap: 40px 20px !important;
      }
      footer .container > div > div:first-child {
        grid-column: span 2 !important;
      }
      footer .container > div > div:first-child p {
        max-width: 100% !important;
      }

      footer a, footer span {
        word-break: break-word;
      }

      .header .container {
        padding-left: 20px !important;
        padding-right: 20px !important;
        width: 100% !important;
        max-width: none !important;
      }

      .hero-section {
        min-height: 75vh;
        display: flex;
      }
      .hero-section::before {
        background-image: url('/images/hero_bg_daruzen.webp');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
      .hero-section::after {
        background: linear-gradient(to right, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 18%, transparent 30%) !important;
      }
      
      .hero-section .hero-title {
        font-size: clamp(38px, 10vw, 63px);
        max-width: 100%;
        overflow-wrap: break-word;
        text-shadow: 0 1px 6px rgba(0,0,0,0.06);
      }
      
      .hero-section .hero-text-container {
        max-width: 100%;
        margin-left: 0;
        margin-top: -150px;
      }
      
      .hero-section .hero-description {
        max-width: 100%;
      }
      .hero-section .hero-description .hero-desc-br {
        display: none !important;
      }
      .hero-section .hero-description .hero-desc-br3 {
        display: inline !important;
      }

      .category-filter-container {
        position: relative;
      }
      .category-filter-container::before {
        content: '';
        position: absolute;
        top: 0; left: 0; bottom: 0;
        width: 80px;
        background: linear-gradient(to right, var(--bg-main) 20%, transparent 100%);
        pointer-events: none;
        z-index: 5;
      }
      .category-filter-container::after {
        content: '';
        position: absolute;
        top: 0; right: 0; bottom: 0;
        width: 80px;
        background: linear-gradient(to left, var(--bg-main) 20%, transparent 100%);
        pointer-events: none;
        z-index: 5;
      }
    }

    /* Arabic mobile - increase photo scale from iPhone SE and up */
    @media (max-width: 778px) {
      html[lang="ar"] .hero-section::before {
        background-size: 310% auto !important;
        background-position: 44% 35% !important;
      }
      html[lang="ar"] .hero-section .hero-description {
        text-shadow: none !important;
      }
    }
    @media (min-width: 390px) and (max-width: 778px) {
      html[lang="ar"] .hero-section::before {
        background-size: 370% auto !important;
      }
    }

    /* ===== Все планшеты / iPad (768–1180px) - ВСЁ В ОДНОМ МЕСТЕ ===== */
    @media (min-width: 768px) and (max-width: 1180px) {
      /* --- ФОН --- */
      html[lang="ar"] .hero-section::before {
        background-position: 34% 45% !important;
        background-size: 200% auto !important;
      }
      /* --- БЛОК ТЕКСТА (заголовок + параграф + кнопка) --- */
      html[lang="ar"] .hero-text-container {
        margin-right: 10%;
        margin-left: 0;
        margin-top: -60px;
        max-width: 48%;
      }
      /* --- ЗАГОЛОВОК --- */
      html[lang="ar"] .hero-title {
        font-size: clamp(38px, 6vw, 72px);
      }
      /* --- ПАРАГРАФ --- */
      html[lang="ar"] .hero-description {
        font-size: clamp(14px, 1.8vw, 20px);
      }
      /* --- КНОПКА --- */
      html[lang="ar"] .hero-actions .btn {
        font-size: 16px;
        padding: 12px 28px;
      }
    }

    /* ===== iPhone SE (375px) ===== */
    @media (min-width: 372px) and (max-width: 378px) {
      html[lang="ar"] .hero-section::before {
        background-position: 45% 32% !important;
        background-size: 300% auto !important;
      }
    }

    /* ===== iPhone 12 / 13 / 14 (390px) ===== */
    @media (min-width: 388px) and (max-width: 395px) {
      html[lang="ar"] .hero-section::before {
        background-position: 44% 46% !important;
        background-size: 340% auto !important;
      }
    }

    /* ===== iPhone XR (414px) ===== */
    @media (min-width: 412px) and (max-width: 418px) {
      html[lang="ar"] .hero-section::before {
        background-position: 44% 48% !important;
        background-size: 340% auto !important;
      }
    }

    /* ===== iPhone 14 Pro Max / 13 Pro Max / 12 Pro Max (430px) ===== */
    @media (min-width: 428px) and (max-width: 435px) {
      html[lang="ar"] .hero-section::before {
        background-position: 44% 50% !important;
        background-size: 320% auto !important;
      }
    }

    /* ===== iPhone 5 / SE 1st gen / старые (320px) ===== */
    @media (min-width: 318px) and (max-width: 323px) {
      html[lang="ar"] .hero-section::before {
        background-position: 55% 55% !important;
        background-size: 320% auto !important;
      }
    }

    /* ===== iPhone 15 / 16 / 15 Pro / 16 Pro (393px) ===== */
    @media (min-width: 391px) and (max-width: 395px) {
      html[lang="ar"] .hero-section::before {
        background-position: 50% 55% !important;
        background-size: 375% auto !important;
      }
    }

    /* ===== iPhone 16 Pro Max (440px) ===== */
    @media (min-width: 438px) and (max-width: 442px) {
      html[lang="ar"] .hero-section::before {
        background-position: 44% 55% !important;
        background-size: 320% auto !important;
      }
    }

    /* ===== Samsung Galaxy S8 / S9 / S10 / S20 / A-series (360px) ===== */
    @media (min-width: 358px) and (max-width: 363px) {
      html[lang="ar"] .hero-section::before {
        background-position: 44% 10% !important;
        background-size: 320% auto !important;
      }
    }

    /* ===== Google Pixel 2–4 (409px) ===== */
    @media (min-width: 408px) and (max-width: 410px) {
      html[lang="ar"] .hero-section::before {
        background-position: 50% 57% !important;
        background-size: 375% auto !important;
      }
    }

    /* ===== Samsung Galaxy Fold (подключенный, 344px) ===== */
    @media (min-width: 342px) and (max-width: 347px) {
      html[lang="ar"] .hero-section::before {
        background-position: 42% -35% !important;
        background-size: 380% auto !important;
      }
    }

    /* ===== Samsung Galaxy Fold (сложенный, 280px) ===== */
    @media (min-width: 278px) and (max-width: 283px) {
      html[lang="ar"] .hero-section::before {
        background-position: 55% 55% !important;
        background-size: 320% auto !important;
      }
    }

    /* ===== Samsung Galaxy S20 Ultra (412px) ===== */
    @media (min-width: 411px) and (max-width: 413px) {
      html[lang="ar"] .hero-section::before {
        background-position: 44% 55% !important;
        background-size: 310% auto !important;
      }
    }

    /* ===== Google Pixel 7 / Galaxy Note 20 (411px) ===== */
    @media (min-width: 410px) and (max-width: 411px) {
      html[lang="ar"] .hero-section::before {
        background-position: 50% 57% !important;
        background-size: 375% auto !important;
      }
    }

    .hero-content-wrapper {
      width: 100%;
      position: relative;
      z-index: 1;
    }
    .hero-text-container {
      max-width: clamp(380px, 45vw, 580px);
      text-align: left;
      padding-left: 0;
      /* Negative pull toward the left overlaps the image on wide screens, but
         never closer than ~96px from the viewport's left edge. */
      margin-left: calc(-1 * min(4vw, max(0px, 50vw - 704px)));
    }
    .hero-title {
      font-size: clamp(34px, 5vw, 88px);
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: clamp(16px, 2vw, 28px);
      color: var(--primary);
      overflow-wrap: break-word;
      text-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .hero-br-line3 { display: inline; }
    .hero-desc-br { display: inline; }
    .hero-desc-br2 { display: none; }
    .hero-desc-br3 { display: none; }
    .hero-description {
      font-size: clamp(14px, 1.8vw, 24px);
      line-height: 1.5;
      color: var(--primary);
      opacity: 0.85;
      margin-bottom: clamp(24px, 3vw, 44px);
      font-weight: 400;
        max-width: clamp(320px, 38vw, 520px);
      text-shadow: 0 1px 2px rgba(0,0,0,0.03), 0 0 10px rgba(255,255,255,0.9), 0 2px 14px rgba(255,255,255,0.95);
    }
    .marquee-section {
      background: var(--bg-main);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      overflow: hidden;
      margin-top: 0;
      position: relative;
      z-index: 5;
    }
    .section-title {
      font-size: 40px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 32px;
    }
    .about-card {
      padding: 36px 30px;
      border: 1px solid var(--border);
      border-radius: 24px;
      background: #FFFFFF;
      box-shadow: 0 12px 32px rgba(62,39,35,0.05);
      transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
    }
    .about-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 44px rgba(62,39,35,0.12);
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    @media (min-width: 1115px) and (max-width: 1413px) {
      .hero-text-container {
        /* Push the text block to ~96px from the viewport's left edge,
           same as the 1414px+ layout. */
        margin-left: calc(64px - max(0px, 50vw - 640px));
        padding-left: 0;
        max-width: clamp(380px, 44vw, 560px);
      }
    }

    @media (min-width: 1117px) and (max-width: 1232px) {
      .hero-section::before {
        background-position: 70% center;
        background-size: auto 110%;
      }
      .hero-desc-br { display: none; }
      .hero-desc-br3 { display: inline; }
    }

    @media (min-width: 769px) and (max-width: 1116px) {
      .md-hidden { display: none !important; }
      
      .hero-section {
        min-height: 80vh;
        padding-top: 80px;
        padding-bottom: 60px;
      }
      .hero-section::before {
        background-size: 200% auto;
        background-position: right -520px center;
      }
      
      .hero-title {
        font-size: clamp(38px, 7vw, 76px);
      }
      
      .header .container {
        gap: 10px;
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      
      .header .container > div:first-child {
        flex: 0 0 auto !important;
      }
      
      .header .container > div:last-child {
        flex: 0 0 auto !important;
        gap: 8px !important;
      }
      
      .hero-text-container {
        max-width: clamp(380px, 45vw, 540px);
        padding-left: 0;
        margin-left: 0;
        position: relative;
        z-index: 2;
      }
      
      .hero-description {
        max-width: 100%;
      }
    }

    @media (min-width: 760px) and (max-width: 874px) {
      .hero-section::before {
        background-position: right -200px top 55%;
        background-size: 140% auto;
      }
      .hero-title {
        font-size: clamp(38px, 7.5vw, 76px);
      }
      .hero-text-container {
        max-width: clamp(400px, 48vw, 540px);
      }
    }
    @media (min-width: 360px) and (max-width: 778px) {
      .hero-section::before {
        background-position: right -365px bottom -120px;
        background-size: 290% auto;
      }
    }

    @media (min-width: 360px) and (max-width: 600px) {
      .hero-section::before {
        background-position: right -395px bottom -120px;
        background-size: 310% auto;
      }
    }
    @media (min-width: 600px) and (max-width: 704px) {
      .hero-section::before {
        background-position: right -380px bottom -120px;
        background-size: 300% auto;
      }
    }

    @media (max-width: 375px) {
      .hero-section::before {
        background-position: right -295px bottom -80px;
        background-size: 260% auto;
      }
      .hero-section .hero-text-container {
        margin-top: -80px;
      }
    }

    @media (min-width: 358px) and (max-width: 362px) {
      .hero-section::before {
        background-size: 300% auto;
        background-position: right -325px bottom -100px;
      }
    }

    @media (min-width: 390px) and (max-width: 778px) {
      .hero-section::before {
        background-size: 350% auto;
        background-position: right -450px bottom -120px;
      }
    }

    @media (min-width: 428px) and (max-width: 432px) {
      .hero-section::before {
        background-position: right -465px bottom -120px;
      }
    }

    @media (min-width: 438px) and (max-width: 442px) {
      .hero-section::before {
        background-position: right -470px bottom -120px;
      }
      .hero-section .hero-title {
        font-size: clamp(42px, 10.5vw, 70px);
      }
      .hero-section .hero-description {
        font-size: clamp(14px, 1.7vw, 23px);
      }
      .hero-section .hero-actions .btn {
        font-size: 15px;
        padding: 11px 26px;
      }
    }

    @media (min-width: 388px) and (max-width: 392px) {
      .hero-section::before {
        background-position: right -480px bottom -120px;
      }
    }

    @media (min-width: 376px) and (max-width: 416px) {
      .hero-section .hero-title {
        font-size: clamp(40px, 11vw, 68px);
      }
      .hero-section .hero-text-container {
        margin-top: -150px;
      }
    }

    /* iPhone 8+ / Plus (≈414px): чуть меньше зум фона, блок текста ниже
       и немного компактнее. */
    @media (min-width: 405px) and (max-width: 423px) {
      .hero-section::before {
        background-size: 320% auto;
        background-position: right -420px bottom -120px;
      }
      .hero-section .hero-text-container {
        margin-top: -90px;
      }
      .hero-section .hero-title {
        font-size: clamp(36px, 9.5vw, 52px);
      }
      .hero-section .hero-description {
        font-size: clamp(13px, 3.4vw, 15px);
        margin-bottom: 20px;
      }
      .hero-section .hero-actions .btn {
        font-size: 13px;
        padding: 9px 20px;
      }
    }

    @media (min-width: 350px) and (max-width: 400px) {
      .hero-desc-br { display: none !important; }
      .hero-desc-br3 { display: inline !important; }
    }

    /* 448–778: фон по-экранно, под текстом слева чистая зона.
       Меняй background-position (сдвиг) и background-size (масштаб) по каждому экрану. */
    @media (min-width: 448px) and (max-width: 479px) {
  .hero-section::before {
    background-size: cover;
    background-position: 45% 75%;
  }
  .hero-section .hero-title {
    font-size: min(clamp(38px, 10vw, 63px), calc(100vh * 0.085));
  }
}
@media (min-width: 480px) and (max-width: 559px) {
  .hero-section::before {
    background-size: cover;
    background-position: 42% 75%;
  }
  .hero-section .hero-title {
    font-size: min(clamp(38px, 10vw, 63px), calc(100vh * 0.085));
  }
}
@media (min-width: 560px) and (max-width: 639px) {
  .hero-section::before {
    background-size: cover;
    background-position: 38% 75%;
  }
  .hero-section .hero-title {
    font-size: min(clamp(38px, 10vw, 63px), calc(100vh * 0.085));
  }
}
@media (min-width: 640px) and (max-width: 703px) {
  .hero-section::before {
    background-size: cover;
    background-position: 35% 75%;
  }
  .hero-section .hero-title {
    font-size: min(clamp(38px, 10vw, 63px), calc(100vh * 0.085));
  }
}
@media (min-width: 704px) and (max-width: 778px) {
  .hero-section::before {
    background-size: 170% auto;
    background-position: right -300px bottom -120px;
  }
  .hero-section .hero-title {
    font-size: min(clamp(38px, 10vw, 63px), calc(100vh * 0.085));
  }
}
@media (min-width: 448px) and (max-width: 778px) and (max-height: 650px) {
      .hero-section .hero-text-container { margin-top: -40px; }
    }
    @media (min-width: 448px) and (max-width: 778px) and (min-height: 651px) and (max-height: 800px) {
      .hero-section .hero-text-container { margin-top: -60px; }
    }

    @media (min-width: 874px) and (max-width: 1116px) {
      .hero-section::before {
        background-size: 120% auto;
        background-position: right -100px center;
      }
    }

    @media (max-width: 1024px) {
      .hero-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
    @media (max-width: 640px) {
      .sm-hidden { display: none !important; }
    }

    .header-logo {
      width: clamp(56px, 14vw, 80px);
      height: auto;
      aspect-ratio: 1;
      object-fit: contain;
      filter: brightness(0) saturate(100%) invert(26%) sepia(13%) saturate(1185%) hue-rotate(331deg) brightness(94%) contrast(89%);
    }

    @media (max-width: 480px) {
      .cart-drawer-item {
        flex-direction: column !important;
        align-items: stretch !important;
      }
      .cart-drawer-item-image {
        height: 210px;
      }
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 60px;
      margin-bottom: 60px;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 40px 20px;
      }
      .footer-grid > div:first-child {
        grid-column: span 2;
      }
    }

    @media (max-width: 480px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      .footer-grid > div:first-child {
        grid-column: span 1;
      }
    }

    .contacts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 80px;
      align-items: start;
    }

    @media (max-width: 768px) {
      .contacts-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }

    .catalog-header {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
    }

    @media (max-width: 768px) {
      .catalog-header {
        flex-direction: column;
        gap: 16px;
        margin-bottom: 32px;
      }
    }

    .product-card-title {
      font-size: 17px;
      font-weight: 600;
      margin-bottom: 12px;
      height: 44px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.3;
    }

    .product-card-price {
      font-size: clamp(18px, 3vw, 20px);
      font-weight: 800;
      color: var(--primary-dark);
      letter-spacing: -0.01em;
    }

    .hero-actions {
      width: auto;
    }

    .hero-actions .btn {
      width: auto;
      padding: clamp(10px, 1.5vw, 16px) clamp(20px, 3vw, 40px);
      font-size: clamp(14px, 1.5vw, 20px);
      font-weight: 700;
      border-radius: clamp(40px, 5vw, 100px);
    }

    /* Mobile text normalization */
    .product-card-title,
    .hero-title,
    .hero-description,
    .section-title,
    .mobile-menu-link,
    .cart-drawer-item > div > div:first-child {
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .cart-drawer-item {
      padding: 20px 0;
      gap: 20px;
    }

    .cart-drawer-item-image {
      width: 100%;
      height: 260px;
      overflow: hidden;
      border-radius: var(--radius-md);
      background: #ffffff;
      padding: 12px;
    }

    .cart-item-img {
      object-fit: contain;
    }

    .qty-btn {
      border-radius: 10px;
      background: transparent !important;
      outline: none !important;
      -webkit-tap-highlight-color: transparent !important;
      -webkit-tap-highlight-color: transparent;
    }
    .qty-btn:active,
    .qty-btn:focus,
    .qty-btn:focus-visible,
    .qty-btn:hover {
      background: transparent !important;
      outline: none !important;
      box-shadow: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }

    /* Mobile cart normalization */
    @media (max-width: 768px) {
      .cart-drawer-item {
        padding: 16px 0 !important;
        gap: 16px !important;
      }

      .cart-item-img {
        object-fit: contain;
      }

      .cart-drawer-item > div > div:first-child {
        font-size: 15px !important;
        marginBottom: 2px !important;
      }

      .cart-drawer-item > div > div:first-child + div {
        font-size: 16px !important;
      }

      .cart-drawer-item > div > div:last-child {
        gap: 10px !important;
        marginTop: 8px !important;
      }
    }

    /* RTL adjustments */
    [dir="rtl"] .hero-text-container {
      padding-left: 24px;
      padding-right: 0;
    }

    [dir="rtl"] .category-filter-container::before {
      left: auto;
      right: 0;
      background: linear-gradient(to left, var(--bg-main) 20%, transparent 100%);
    }

    [dir="rtl"] .category-filter-container::after {
      right: auto;
      left: 0;
      background: linear-gradient(to right, var(--bg-main) 20%, transparent 100%);
    }

    [dir="rtl"] .footer-grid {
      text-align: right;
    }

    [dir="rtl"] .contacts-grid {
      text-align: right;
    }

    [dir="rtl"] .product-card {
      text-align: right;
    }

    [dir="rtl"] .cart-drawer-item {
      flex-direction: row-reverse;
      text-align: right;
    }

    @media (max-width: 1024px) {
      [dir="rtl"] .hero-text-container {
        padding-left: 24px;
        padding-right: 0;
      }
    }

    @media (max-width: 768px) {
      [dir="rtl"] .hero-text-container {
        padding-left: 24px;
        padding-right: 0;
      }
    }

    /* 769–1116: desktop-like hero — smaller text so it fits the viewport */
    @media (min-width: 769px) and (max-width: 1116px) {
      .hero-text-container {
        margin-left: calc(64px - max(0px, 50vw - 640px));
      }
      .hero-title {
        font-size: clamp(34px, 5.8vw, 66px);
      }
      .hero-description {
        font-size: clamp(15px, 1.5vw, 19px);
      }
      .hero-actions .btn {
        padding: clamp(10px, 1.2vw, 14px) clamp(18px, 2.6vw, 34px);
        font-size: clamp(13px, 1.3vw, 16px);
      }
    }

    /* 769–873: slightly larger title, bg shifted a bit further left */
    @media (min-width: 769px) and (max-width: 873px) {
      .hero-title {
        font-size: clamp(36px, 6.4vw, 70px);
      }
      .hero-section::before {
        background-position-x: right -200px;
      }
    }

    /* 500–778 (tablet/landscape): lower, smaller title; bg less zoomed */
    @media (min-width: 500px) and (max-width: 778px) {
      .hero-section .hero-title {
        font-size: min(clamp(32px, 8vw, 50px), calc(100vh * 0.085));
      }
      .hero-section::before {
        background-size: auto 100%;
        background-position: right calc(-100px - max(0px, 736px - 100vw) * 0.8) center;
      }
    }
    @media (min-width: 500px) and (max-width: 778px) {
      .hero-section .hero-text-container {
        margin-top: 30px;
      }
    }

    /* 360–447: smaller bg, smaller and lower title */
    @media (min-width: 360px) and (max-width: 447px) {
      .hero-section::before {
        background-size: auto 100%;
        background-position: right -300px center;
      }
      .hero-section .hero-title {
        font-size: clamp(34px, 9vw, 44px);
      }
      .hero-section .hero-text-container {
        margin-top: -90px;
      }
    }

    /* ≤397: bg slightly lower, smaller button so it balances the title */
    @media (max-width: 397px) {
      .hero-section::before {
        background-size: auto max(100%, calc(104% - max(0px, 400px - 100vw) * 0.85));
        background-position-x: right calc(-270px - max(0px, 400px - 100vw) * 1.5);
        background-position-y: 20%;
      }
      .hero-section .hero-actions .btn {
        font-size: 13px;
        padding: 8px 16px;
      }
      .hero-section .hero-text-container {
        margin-top: -110px;
      }
    }

    /* Mobile menu styles */
    .mobile-menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 2500;
    }
    .mobile-menu-content {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      max-width: 420px;
      z-index: 2501;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    .mobile-menu-link {
      cursor: pointer;
    }
  `}
</style>
);

export default AppStyles;
