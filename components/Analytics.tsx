import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MJ756M56";

// Google Tag Manager. Production only, so local/dev traffic doesn't pollute the analytics.
export default function Analytics() {
  if (process.env.NODE_ENV !== "production" || !GTM_ID) return null;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
    </>
  );
}

// GTM's <noscript> fallback; render as the first child of <body>.
export function AnalyticsNoScript() {
  if (process.env.NODE_ENV !== "production" || !GTM_ID) return null;
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
    </noscript>
  );
}
