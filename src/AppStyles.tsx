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
      padding-top: clamp(100px, 9vh, 140px);
      padding-bottom: clamp(120px, 11vh, 180px);
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
      background-size: cover;
      background-position: right center;
    }
        html[lang="ar"] .hero-section::before {
      background-image: url('/images/hero_bg_daruzen_ar.webp');
            background-color: #5a4a3f;
      background-size: cover;
      background-position: center;
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
        margin-top: 0;
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

    /* Arabic mobile - единое плавное правило, без per-device хаков */
    @media (max-width: 778px) {
      html[lang="ar"] .hero-section::before {
        background-color: #5a4a3f;
        background-size: cover !important;
        background-position: center center !important;
      }
      html[lang="ar"] .hero-section .hero-description {
        text-shadow: none !important;
      }
    }

    /* ===== Все планшеты / iPad (768–1180px) - ВСЁ В ОДНОМ МЕСТЕ ===== */
    @media (min-width: 768px) and (max-width: 1180px) {
      /* --- ФОН --- */
      html[lang="ar"] .hero-section::before {
        background-size: cover;
        background-position: center center;
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
      border: 1px solid rgba(93, 64, 55, 0.09);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 8px 24px rgba(62, 39, 35, 0.04);
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
        margin-left: calc(32px - max(0px, 50vw - 640px));
        padding-left: 0;
        max-width: clamp(380px, 44vw, 560px);
      }
    }

    @media (min-width: 1117px) and (max-width: 1232px) {
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
        background-size: cover;
        background-position: center;
      }
      
      .hero-title {
        font-size: clamp(34px, 6vw, 70px);
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
        margin-left: calc(32px - max(0px, 50vw - 640px));
        position: relative;
        z-index: 2;
      }
      
      .hero-description {
        max-width: 100%;
      }
    }

    /* Mobile: единая плавная адаптация (вместо per-device хаков).
       Фон всегда cover + центр, заголовок и описание резиновые через clamp. */
    @media (max-width: 778px) {
      .hero-section::before {
        background-size: cover;
        background-position: center;
      }
      .hero-section .hero-title {
        font-size: min(clamp(38px, 10vw, 63px), calc(100vh * 0.085));
      }
      .hero-section .hero-text-container {
        margin-top: 0;
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
      text-wrap: balance;
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

    /* 769–873: чуть крупнее заголовок на узких планшетах */
    @media (min-width: 769px) and (max-width: 873px) {
      .hero-title {
        font-size: clamp(36px, 6.4vw, 70px);
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
