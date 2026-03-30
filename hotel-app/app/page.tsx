import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Hotel, MessageSquare, Ticket } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Welcome to <span className="text-blue-600">LuxeStay</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Your premium gateway to exceptional hotel stays, world-class activities, and 24/7 dedicated concierge service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Hotel size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Hotels & Rooms</h2>
          <p className="text-gray-600 mb-6 flex-grow">Discover luxurious accommodations around the globe, tailored to your exact preferences.</p>
          <Link href="/hotels" className="w-full">
            <Button className="w-full" size="lg">Explore Hotels</Button>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Virtual Concierge</h2>
          <p className="text-gray-600 mb-6 flex-grow">Connect with our 24/7 digital concierge for instant assistance and personalized recommendations.</p>
          <Link href="/concierge" className="w-full">
            <Button className="w-full" size="lg" variant="outline">Chat Now</Button>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Ticket size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Activities</h2>
          <p className="text-gray-600 mb-6 flex-grow">Book exclusive experiences, from relaxing spa packages to thrilling local adventures.</p>
          <Link href="/activities" className="w-full">
            <Button className="w-full" size="lg" variant="outline">View Activities</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
