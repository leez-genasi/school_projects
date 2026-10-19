import { SiteFooter, SiteHeader } from "../components"
import { assets } from "../data"

const images = {
  logo: `${assets}/a5ec6.png`,
  flowers: `${assets}/24b70.png`,
  cup: `${assets}/01623.png`,
  people: `${assets}/21534.png`,
  barista: `${assets}/dadc9.png`,
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      alt="Shiki Coffee"
      className={`object-contain ${className}`}
      src={images.logo}
    />
  )
}

function CoffeeCup() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[110px] -top-[42px] z-0 h-[330px] w-[250px] max-lg:-left-20 max-lg:scale-90 max-sm:hidden"
    >
      <img
        alt=""
        className="absolute -left-6 -top-7 h-[52px] w-[198px] -scale-y-100 rotate-[72.49deg] object-contain"
        src={images.flowers}
      />
      <img
        alt=""
        className="absolute -right-8 top-[122px] h-[83px] w-[315px] rotate-[130.38deg] object-contain"
        src={images.flowers}
      />
      <img
        alt=""
        className="absolute -right-20 top-2 h-[68px] w-[257px] -scale-y-100 rotate-[114.11deg] object-contain"
        src={images.flowers}
      />
      <div className="absolute left-3 top-1 h-[317px] w-[217px] rotate-[19.19deg] overflow-hidden">
        <img
          alt="Reusable Shiki Coffee cup"
          className="h-full w-full scale-[1.46] object-contain"
          src={images.cup}
        />
        <Logo className="absolute left-[67px] top-[145px] size-[84px] mix-blend-multiply" />
      </div>
    </div>
  )
}

function ValueCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <article className="relative z-10 flex min-h-[250px] flex-col items-center justify-center rounded-[18px] bg-terracotta px-5 text-center text-cream">
      <h2 className="mb-3 font-raleway-bold text-[21px] leading-[22px] font-bold">
        {title}
      </h2>
      <p className="max-w-[150px] text-base leading-[19px]">{children}</p>
    </article>
  )
}

function Values() {
  return (
    <div className="relative mx-auto grid w-full max-w-[810px] grid-cols-2 gap-2.5 lg:grid-cols-4">
      <img
        alt="Friends talking inside a bright coffee shop"
        className="relative z-10 col-span-2 h-[250px] w-full rounded-[18px] object-cover lg:col-span-2"
        src={images.people}
      />
      <ValueCard title="Affordable Quality">
        Studenthood can expensive. Our coffee isn’t.
      </ValueCard>
      <div className="relative z-0 hidden lg:block">
        <CoffeeCup />
      </div>
      <ValueCard title="Sustainability">
        Ethically sourced beans and eco-conscious choices.
      </ValueCard>
      <ValueCard title="Warm Community">
        Everyone is welcome, no matter the reason or time.
      </ValueCard>
      <img
        alt="A barista pouring milk into a ceramic mug"
        className="relative z-10 h-[250px] w-full rounded-[18px] object-cover object-center lg:col-span-2"
        src={images.barista}
      />
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-cream text-forest">
      <SiteHeader />
      <main id="about">
        <section className="flex h-[325px] items-end justify-center bg-forest px-4 pb-[42px] text-cream">
          <h1 className="font-script text-[84px] leading-none text-shadow-[0_6px_4px_rgba(0,0,0,0.5)] sm:text-[120px] lg:text-[144px]">
            About Us
          </h1>
        </section>
        <section className="px-5 pb-[118px] pt-[66px] sm:px-8">
          <p className="mx-auto mb-[44px] max-w-[415px] text-center text-[21px] leading-[26px]">
            <em className="font-raleway-italic">Shiki Coffee</em> originated in
            the homes of two final-year students, aiming to make quality coffee
            that fuels energy, creativity, and ambition, from class to cup.
          </p>
          <Values />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
