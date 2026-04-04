'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const BranchMap = dynamic(() => import('../components/map/BranchMap'), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero with background image */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
            alt="Kuriftu lakeside resort"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/60 to-surface" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-40 text-center">
          <span className="text-secondary font-bold tracking-widest text-[11px] uppercase mb-6 block">
            Kuriftu Resorts & Spa
          </span>
          <h1 className="text-5xl md:text-7xl font-headline tracking-tight text-primary mb-6 leading-[1.1]">
            The Lakeside<br />Curated Living
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-12">
            Experience Ethiopia&apos;s finest resorts across four breathtaking locations.
            Let Aura, your AI concierge, orchestrate a seamless journey from highland retreats to lakeside sanctuaries.
          </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/hotels">
            <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 shadow-lg">
              Book Your Stay
            </button>
          </Link>
          <Link href="/concierge">
            <button className="bg-surface-container-lowest text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-high transition-all border border-outline-variant/15">
              Talk to Aura
            </button>
          </Link>
        </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/hotels" className="group">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all h-full">
              <div className="w-14 h-14 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">hotel</span>
              </div>
              <h2 className="text-xl font-headline text-primary mb-3">Signature Stays</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Lakeside suites, garden villas, and highland retreats across four Kuriftu branches.
              </p>
            </div>
          </Link>

          <Link href="/concierge" className="group">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all h-full">
              <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">smart_toy</span>
              </div>
              <h2 className="text-xl font-headline text-primary mb-3">Aura Concierge</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Your AI-powered personal concierge — dining, activities, and transport, all orchestrated for you.
              </p>
            </div>
          </Link>

          <Link href="/activities" className="group">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all h-full">
              <div className="w-14 h-14 bg-tertiary-container text-on-tertiary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">explore</span>
              </div>
              <h2 className="text-xl font-headline text-primary mb-3">Curated Experiences</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Kayaking, spa rituals, safari drives, monastery tours — handpicked for your persona.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Branch Map */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-headline text-primary mb-3">The Kuriftu Loop</h2>
          <p className="text-on-surface-variant max-w-lg mx-auto">
            Four resorts, one seamless journey. Explore our branches across Ethiopia&apos;s most stunning landscapes.
          </p>
        </div>
        <BranchMap />
      </section>
    </div>
  );
}
