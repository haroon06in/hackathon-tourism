'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useGuest } from '../../../contexts/GuestContext';
import { useCurrentBranch } from '../../../hooks/useCurrentBranch';
import { useToast } from '../../../components/ui/Toast';
import { api } from '../../../lib/api';
import { Location, MenuItem } from '../../../types/location';

const CATEGORY_ICONS: Record<string, string> = {
  breakfast: 'egg_alt', main: 'restaurant', starter: 'tapas', snack: 'cookie',
  dessert: 'cake', beverage: 'local_cafe',
};

export default function RoomServicePage() {
  const { guest, isLoading: guestLoading } = useGuest();
  const { branchName, branchSlug } = useCurrentBranch();
  const { notify } = useToast();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: api.getLocations,
  });

  useEffect(() => {
    if (!guestLoading && !guest) router.push('/login');
  }, [guest, guestLoading, router]);

  const currentLocation = locations.find((l) => l.slug === branchSlug) || locations[0];
  const menu: MenuItem[] = (currentLocation?.menu as MenuItem[]) || [];
  const dietaryPref = String((guest?.preferences as Record<string, unknown>)?.dietary || 'None');

  const categories = useMemo(() => {
    const cats = [...new Set(menu.map((m) => m.category))];
    return ['all', ...cats];
  }, [menu]);

  const filteredMenu = selectedCategory === 'all' ? menu : menu.filter((m) => m.category === selectedCategory);

  const addToCart = (itemName: string) => {
    setCart((prev) => {
      const next = new Map(prev);
      next.set(itemName, (next.get(itemName) || 0) + 1);
      return next;
    });
  };

  const removeFromCart = (itemName: string) => {
    setCart((prev) => {
      const next = new Map(prev);
      const count = next.get(itemName) || 0;
      if (count <= 1) next.delete(itemName);
      else next.set(itemName, count - 1);
      return next;
    });
  };

  const cartTotal = [...cart.entries()].reduce((total, [name, qty]) => {
    const item = menu.find((m) => m.name === name);
    return total + (item?.price || 0) * qty;
  }, 0);

  const handleOrder = () => {
    setOrderPlaced(true);
    notify('Room service order placed!', 'success', 'room_service');
  };

  if (guestLoading || !guest) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-6 pb-24 pt-8 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[40px]">check</span>
        </div>
        <h1 className="text-3xl font-headline text-primary mb-3">Order Placed</h1>
        <p className="text-on-surface-variant mb-2">Your room service order is being prepared at <strong>{currentLocation?.name}</strong>.</p>
        <p className="text-sm text-on-surface-variant mb-8">Estimated delivery: 20-30 minutes</p>
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 mb-8 text-left">
          {[...cart.entries()].map(([name, qty]) => {
            const item = menu.find((m) => m.name === name);
            return (
              <div key={name} className="flex justify-between py-2">
                <span className="text-sm">{qty}x {name}</span>
                <span className="text-sm font-bold">${(item?.price || 0) * qty}</span>
              </div>
            );
          })}
          <div className="flex justify-between pt-3 mt-3 border-t border-outline-variant/10 font-bold">
            <span>Total</span>
            <span>${cartTotal}</span>
          </div>
        </div>
        <button onClick={() => router.push('/dashboard')}
          className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pb-24 pt-8 animate-in fade-in duration-500 w-full">
      <span className="text-secondary font-bold tracking-widest text-[11px] uppercase mb-2 block">
        {currentLocation?.name || 'Room Service'}
      </span>
      <h1 className="text-3xl md:text-4xl font-headline text-primary mb-3">Room Service</h1>
      <p className="text-on-surface-variant mb-8">
        Order from your branch&apos;s menu. {dietaryPref !== 'None' && <>Items matching your <strong>{dietaryPref}</strong> preference are highlighted.</>}
      </p>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant hover:border-primary/30'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredMenu.map((item) => {
          const matchesDiet = dietaryPref !== 'None' && item.dietary.some((d) => d.toLowerCase() === dietaryPref.toLowerCase());
          const inCart = cart.get(item.name) || 0;

          return (
            <div key={item.name}
              className={`bg-surface-container-lowest rounded-xl p-5 border transition-all ${matchesDiet ? 'border-primary/30 bg-primary-fixed/10' : 'border-outline-variant/10'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{CATEGORY_ICONS[item.category] || 'restaurant'}</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-primary">${item.price}</span>
                      {item.dietary.length > 0 && (
                        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                          {item.dietary.join(', ')}
                        </span>
                      )}
                    </div>
                    {matchesDiet && (
                      <span className="text-[10px] uppercase tracking-widest font-bold text-primary mt-1 inline-block">
                        <span className="material-symbols-outlined text-[12px] align-middle mr-0.5">check_circle</span>
                        Matches your diet
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {inCart > 0 && (
                    <button onClick={() => removeFromCart(item.name)}
                      className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                  )}
                  {inCart > 0 && <span className="text-sm font-bold w-6 text-center">{inCart}</span>}
                  <button onClick={() => addToCart(item.name)}
                    className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-all">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart footer */}
      {cart.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/10 p-4 z-40 animate-in slide-in-from-bottom-4 duration-300">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-on-surface">{cart.size} items · ${cartTotal}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Delivery to your room</p>
            </div>
            <button onClick={handleOrder}
              className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">room_service</span>
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
