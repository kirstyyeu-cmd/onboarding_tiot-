import Link from "next/link";
import { Truck, Package, ShieldCheck, Clock, Users, MapPin } from "lucide-react";
import Header from "./components/Header";
import QuickLinksBar from "./components/QuickLinksBar";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Header showHamburger />

      {/* Hero */}
      <section className="max-w-xl mx-auto px-6 pt-16 pb-10">
        <h1 className="text-3xl font-semibold leading-tight mb-3">
          Move goods.
          <br />
          Deliver with
          <br />
          <span className="text-green-700">confidence.</span>
        </h1>
        <p className="text-sm text-gray-600 mb-8 max-w-xs">
          Reliable logistics and courier services connecting customers with
          drivers.
        </p>

        <p className="text-sm font-medium mb-3">What are you here to do?</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-2">
          <Link
            href="/onboarding"
            className="flex-1 bg-green-50 border border-green-100 rounded-lg p-4 hover:bg-green-100 transition"
          >
            <Truck size={24} className="text-green-700 mb-2" />
            <p className="text-base font-medium mb-1">I am a driver</p>
            <p className="text-xs text-green-800">
              Earn by delivering with us →
            </p>
          </Link>
          <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg p-4 opacity-70 cursor-not-allowed">
            <Package size={24} className="text-orange-600 mb-2" />
            <p className="text-base font-medium mb-1">I am a customer</p>
            <p className="text-xs text-orange-800">Send or receive deliveries</p>
          </div>
        </div>
      </section>

      {/* Collapsible quick links */}
      <QuickLinksBar defaultOpen />

      {/* Why choose us */}
      <section className="max-w-xl mx-auto px-6 py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Why choose TakeOFF?</h2>
        <p className="text-sm text-gray-600 mb-10">
          We make logistics simple, fast and reliable for everyone.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <Feature icon={<ShieldCheck size={20} className="text-green-700" />} bg="bg-green-50" title="Safe and secure" desc="Your parcels and info are protected" />
          <Feature icon={<Clock size={20} className="text-orange-600" />} bg="bg-orange-50" title="Fast delivery" desc="On time, every time" />
          <Feature icon={<Users size={20} className="text-green-700" />} bg="bg-green-50" title="Trusted drivers" desc="Verified and professional" />
          <Feature icon={<MapPin size={20} className="text-orange-600" />} bg="bg-orange-50" title="Real-time tracking" desc="Know where your package is" />
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  bg,
  title,
  desc,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
}) {
  return (
    <div>
      <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center mx-auto mb-2`}>
        {icon}
      </div>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}