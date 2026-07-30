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
    }
    .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background-image: url('/1c5221f4-d246-4584-b49e-f003d74f910b.png');
      background-size: cover;
      background-position: right center;
      background-repeat: no-repeat;
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
        --mobile-bg-scale: 170%;
        --mobile-bg-pos-x: right -160px;
        --mobile-bg-pos-y: top 62%;
        min-height: 75vh;
        display: flex;
      }
      .hero-section::before {
        background-image: url('/images/image.webp') !important;
        background-repeat: no-repeat !important;
        background-size: var(--mobile-bg-scale) auto !important;
        background-position: var(--mobile-bg-pos-x) var(--mobile-bg-pos-y) !important;
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
      }
      
      .hero-section .hero-description {
        max-width: 100%;
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
      margin-left: clamp(0px, -2vw, -40px);
    }
    .hero-title {
      font-size: clamp(36px, 6vw, 96px);
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: clamp(16px, 2vw, 28px);
      color: var(--primary);
      overflow-wrap: break-word;
      text-shadow: 0 1px 6px rgba(0,0,0,0.06);
    }
    .hero-br-line3 { display: inline; }
    .hero-desc-br { display: inline; }
    .hero-desc-br2 { display: none; }
    .hero-description {
      font-size: clamp(14px, 1.8vw, 24px);
      line-height: 1.5;
      color: var(--primary);
      opacity: 0.8;
      margin-bottom: clamp(24px, 3vw, 44px);
      font-weight: 400;
        max-width: clamp(320px, 38vw, 520px);
      text-shadow: 0 1px 6px rgba(0,0,0,0.06);
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
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    @media (min-width: 1117px) and (max-width: 1232px) {
      .hero-section::before {
        background-position: 70% center;
        background-size: auto 100%;
      }
      .hero-desc-br { display: none; }
      .hero-desc-br2 { display: inline; }
    }

    @media (min-width: 780px) and (max-width: 1116px) {
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
        background-position: right -240px top 78% !important;
        background-size: 145% auto !important;
      }
    }

    @media (min-width: 360px) and (max-width: 600px) {
      .hero-section::before {
        background-position: right -150px top 65% !important;
        background-size: 180% auto !important;
      }
    }

    @media (min-width: 600px) and (max-width: 704px) {
      .hero-section::before {
        background-position: right -190px top 70% !important;
        background-size: 155% auto !important;
      }
    }

    @media (min-width: 370px) and (max-width: 416px) {
      .hero-section .hero-title {
        font-size: clamp(40px, 11vw, 68px);
      }
      .hero-section .hero-text-container {
        margin-top: -40px;
      }
    }

    @media (min-width: 874px) and (max-width: 1116px) {
      .hero-section::before {
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

    .modal-layout {
      display: flex;
      flex-direction: row;
    }
    .modal-image-wrapper {
      flex: 1.4;
      background: #FFFFFF;
      padding: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      min-height: 300px;
    }
    .modal-image {
      width: 125%;
      height: auto;
      max-height: 500px;
      object-fit: contain;
    }
    .modal-info-wrapper {
      flex: 1;
      padding: 40px;
      display: flex;
      flex-direction: column;
    }
    .modal-title {
      font-size: clamp(22px, 4vw, 32px);
    }
    .modal-price {
      font-size: clamp(20px, 4vw, 28px);
    }
    .modal-desc {
      font-size: clamp(13px, 2.5vw, 16px);
    }
    .modal-buy-btn {
      width: 100%;
      height: clamp(54px, 8vw, 72px);
      font-size: clamp(16px, 2.5vw, 18px);
    }

    @media (max-width: 768px) {
      .modal-layout {
        flex-direction: column;
      }
      .modal-image-wrapper {
        min-height: 240px;
        padding: 24px;
      }
      .modal-image {
        max-height: 240px;
        width: auto;
      }
      .modal-info-wrapper {
        flex: none !important;
        display: block !important;
        padding: 12px 16px 24px !important;
      }
    }

    @media (max-height: 700px) and (max-width: 480px) {
      .modal-image-wrapper {
        min-height: 180px;
        padding: 16px;
      }
      .modal-image {
        max-height: 160px;
      }
      .modal-info-wrapper {
        flex: none !important;
        display: block !important;
        padding: 12px 16px 20px !important;
      }
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
      font-weight: 700;
      color: var(--primary);
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
  `}</style>
);

export default AppStyles;
