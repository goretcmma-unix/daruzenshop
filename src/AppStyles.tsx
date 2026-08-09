const AppStyles = () => (
  <style>{`
    /* Mobile styles */
    @media (max-width: 778px) {
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
    }      .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
            background-image: url('/images/hero_bg_daruzen.webp');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .hero-section::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: linear-gradient(to right, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 22%, transparent 42%);
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
      }      .hero-section::before {
        background-image: url('/images/hero_bg_daruzen.webp');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
      .hero-section::after {
        background: linear-gradient(to right, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 18%, transparent 30%) !important;
      }
      
      .hero-section .hero-title {
        font-size: clamp(38px, 10vw, 68px);
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

    .hero-content-wrapper {
      width: 100%;
      position: relative;
      z-index: 1;
    }
    .hero-text-container {
      max-width: clamp(380px, 45vw, 580px);
      text-align: left;
      padding-left: 0;
      margin-left: clamp(-160px, -6vw, 0px);
    }
    .hero-title {
      font-size: clamp(36px, 6vw, 96px);
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
        margin-left: 0;
        padding-left: clamp(10px, 2vw, 40px);
        max-width: clamp(380px, 44vw, 560px);
      }
    }

    @media (min-width: 1117px) and (max-width: 1232px) {      .hero-section::before {
        background-position: 70% center;
        background-size: auto 100%;
      }
      .hero-desc-br { display: none; }
      .hero-desc-br3 { display: inline; }
    }

    @media (min-width: 780px) and (max-width: 1116px) {
      .md-hidden { display: none !important; }
      
      .hero-section {
        min-height: 80vh;
        padding-top: 80px;
        padding-bottom: 60px;
      }      .hero-section::before {
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

    @media (min-width: 760px) and (max-width: 874px) {      .hero-section::before {
        background-position: right -400px top 55%;
        background-size: 200% auto;
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

    @media (min-width: 360px) and (max-width: 600px) {      .hero-section::before {
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

    @media (min-width: 350px) and (max-width: 400px) {
      .hero-desc-br { display: none !important; }
      .hero-desc-br3 { display: inline !important; }
    }

    @media (min-width: 874px) and (max-width: 1116px) {      .hero-section::before {
        background-size: 185% auto;
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
  `}</style>
);

export default AppStyles;
