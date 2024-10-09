import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, MapPin } from 'lucide-react';

const services = [
  'General Dentistry',
  'Teeth Whitening',
  'Orthodontics',
  'Emergency Care'
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
      />
      <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
            Welcome to Our Dental Office
          </h1>
          <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
            <p className="text-lg leading-8 text-gray-600">
              Providing comprehensive dental services to keep your smile healthy
              and beautiful.
            </p>
            <div className="mt-6 flex items-center gap-x-2">
              <MapPin size={24} className="text-indigo-500" />
              <p className="text-gray-600">1234 Elm Street, Toronto, ON</p>
            </div>
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Services we offer
              </h2>
              <ul className="text-gray-900 flex flex-col gap-1">
                {services.map((service) => (
                  <li className="flex gap-2" key={service}>
                    <span>
                      <CheckIcon className="text-indigo-500" size={24} />
                    </span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex items-center gap-x-6">
              <Button
                size="lg"
                variant="default"
                onClick={() => navigate('/booking')}
              >
                Book an appointment
              </Button>
            </div>
          </div>
          <img
            alt=""
            src="https://images.pexels.com/photos/3663999/pexels-photo-3663999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
    </div>
  );
}

export default Home;
