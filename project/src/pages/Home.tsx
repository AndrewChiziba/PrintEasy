import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Printer, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: <QrCode className="h-6 w-6" />,
    title: 'Scan QR Code',
    description: 'Scan the QR code at any PrintEasy location to start uploading your documents.',
  },
  {
    icon: <Printer className="h-6 w-6" />,
    title: 'Quick Printing',
    description: 'Upload and print your documents directly at our locations.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure Service',
    description: 'Your files are encrypted and automatically deleted after printing.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Fast & Easy',
    description: 'No need for WhatsApp or Telegram. Print directly at our service points.',
  },
];

const Home = () => {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Professional Printing Made Simple
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Visit any PrintEasy location, scan the QR code, and upload your documents directly for printing.
          No WhatsApp or Telegram needed!
        </p>
        <div className="bg-white p-8 rounded-lg shadow-sm inline-block">
          <div className="bg-gray-100 w-48 h-48 mx-auto mb-4 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Demo QR Code</span>
          </div>
          <p className="text-sm text-gray-600">
            Scan this QR code to see how it works
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Use PrintEasy?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="ml-3 text-gray-600">No need to share files through WhatsApp or Telegram</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="ml-3 text-gray-600">Your files are automatically deleted after printing</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="ml-3 text-gray-600">Professional print quality guaranteed</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="ml-3 text-gray-600">Available at multiple locations</span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=1200&q=80"
                alt="Printing Service"
                className="rounded-lg w-full object-cover h-64"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;