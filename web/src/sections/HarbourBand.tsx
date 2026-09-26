// The Morning Watch — Lego-style harbour photograph, framed to the edition
// column width (max-w-6xl, same as the KPI table above it). The corner
// captions are HTML overlays in the site's mono face, so the masthead brand
// and the picture caption always match exactly.
export default function HarbourBand() {
  const caption =
    'absolute flex items-baseline font-mono text-[10px] uppercase tracking-widest text-[#f2ecdf]'
  return (
    <section className="mx-auto max-w-6xl px-5">
      <figure className="relative border border-[#c9bfa9] bg-[#e0d7c2]">
        <picture>
          <source
            srcSet="img/lego-lng-harbour-mobile.webp"
            media="(max-width: 960px)"
            type="image/webp"
          />
          <source srcSet="img/lego-lng-harbour-web.webp" type="image/webp" />
          <img
            src="img/lego-lng-harbour-web.jpg"
            alt="A Lego-style LNG carrier under full steam past the Hong Kong skyline at golden hour"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            className="block h-auto w-full"
          />
        </picture>

        {/* top-right — the edition brand, same type/size/color as the caption below */}
        <span
          className={`${caption} right-0 top-0 justify-end bg-gradient-to-b from-[#241f17b3] to-transparent px-5 pb-8 pt-3`}
        >
          <span className="flex items-center gap-1.5">
            <img
              src="img/tod-mark-paper.png"
              alt=""
              aria-hidden="true"
              width={504}
              height={281}
              className="h-3.5 w-auto opacity-90"
            />
            <span className="text-[#c9bfa9]">The</span>{' '}
            <span className="text-[#f2ecdf]">Onassian</span>{' '}
            <span className="text-[#e0a99f]">Digest</span>
          </span>
        </span>

        <figcaption
          className={`${caption} bottom-0 left-0 right-0 justify-between bg-gradient-to-t from-[#241f17cc] to-transparent px-5 pb-3 pt-10`}
        >
          <span>The Morning Watch — LNG meets the harbor</span>
          <span className="hidden md:inline">22.29° N · 114.17° E · first light</span>
        </figcaption>
      </figure>
    </section>
  )
}
