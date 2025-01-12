import React, { useState } from 'react';
import { QrCode, Printer, BarChart, Plus, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

interface Location {
  id: string;
  name: string;
  address: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('locations');
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState({ name: '', address: '' });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.name || !newLocation.address) {
      toast.error('Please fill in all fields');
      return;
    }

    const location = {
      id: crypto.randomUUID(),
      name: newLocation.name,
      address: newLocation.address,
    };

    setLocations([...locations, location]);
    setNewLocation({ name: '', address: '' });
    toast.success('Location added successfully');
  };

  const handleDeleteLocation = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
    toast.success('Location deleted successfully');
  };

  const generateQRUrl = (locationId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/upload/${locationId}`;
  };

  const downloadQR = (locationId: string, locationName: string) => {
    const canvas = document.getElementById(`qr-${locationId}`) as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `printeasy-${locationName.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-4 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('locations')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'locations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <span>Locations & QR Codes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Printer className="h-5 w-5" />
                <span>Print Queue</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>Analytics</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'locations' && (
            <div className="space-y-6">
              <form onSubmit={handleAddLocation} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location Name</label>
                    <input
                      type="text"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Main Branch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="123 Main St"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                  <div key={location.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
                        <p className="text-sm text-gray-500">{location.address}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                      <QRCodeSVG
                        id={`qr-${location.id}`}
                        value={generateQRUrl(location.id)}
                        size={200}
                        level="H"
                        includeMargin
                      />
                      <button
                        onClick={() => downloadQR(location.id, location.name)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Download QR Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {locations.length === 0 && (
                <div className="text-center py-12">
                  <QrCode className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No locations</h3>
                  <p className="mt-1 text-sm text-gray-500">Add a location to generate QR codes.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Print Queue</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-center">No files in queue</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">Total Locations</h3>
                  <p className="text-2xl font-bold text-blue-900">{locations.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Active Uploads</h3>
                  <p className="text-2xl font-bold text-green-900">0</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">Files Printed</h3>
                  <p className="text-2xl font-bold text-purple-900">0</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;