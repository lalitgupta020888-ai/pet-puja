import Image from 'next/image';
import { signatures } from '@/data/menu';
import { img } from '@/lib/images';
import SectionHeading from './SectionHeading';
import AddToCart from './AddToCart';

export default function Signatures() {
  return (
    <section className="relative py-28 lg:py-40">
      <div className="shell">
        <SectionHeading
          hi="ख़ास"
          eyebrow="What we are known for"
          title="Four dishes that"
          accent="made our name"
          lead="Order anything on the menu and you will eat well. Order one of these and you will understand why people keep driving back."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signatures.map((dish, i) => (
            <article
              key={dish.id}
              className="reveal group relative overflow-hidden rounded-3xl border border-white/[0.07]"
              style={{ '--reveal-delay': `${i * 90}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={img(dish.photo, { w: 700, h: 930 })}
                  alt={dish.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bark-950 via-bark-950/35 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl font-normal text-cream-50">{dish.name}</h3>
                  <span className="shrink-0 font-display text-xl text-ember-300">₹{dish.price}</span>
                </div>
                {/*
                  Always open on touch sizes — there is no hover there, and the
                  add button must stay reachable. Desktop keeps the reveal, and
                  focus-within opens it for keyboard users.
                */}
                <div className="max-h-48 overflow-hidden opacity-100 transition-all duration-500 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-48 lg:group-hover:opacity-100 lg:group-focus-within:max-h-48 lg:group-focus-within:opacity-100">
                  <p className="mt-2 text-sm leading-relaxed text-cream-300/80">
                    {dish.description}
                  </p>
                  <div className="mt-4">
                    <AddToCart
                      item={{
                        kind: 'dish',
                        id: dish.id,
                        name: dish.name,
                        price: dish.price,
                        photo: dish.photo,
                        veg: dish.veg,
                      }}
                    />
                  </div>
                </div>
              </div>

              <span className="absolute left-5 top-5 rounded-full border border-ember-400/40 bg-bark-950/60 px-3 py-1 text-[0.6rem] uppercase tracking-widest text-ember-300 backdrop-blur">
                Signature
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
