import React, { useState, useEffect } from 'react';
import { QrCode, Printer, BarChart, Plus, Trash2, MessageCircle, Mail, Phone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { fetchLocations, addLocation, deleteLocation, fetchPrintQueue, printFile, fetchAnalytics } from '../services/api';


interface Location {
  _id?: string;
  name: string;
  address: string;
  contacts: {
    whatsapp?: string;
    telegram?: string;
    email?: string;
    phone?: string;
  };
}

interface PrintQueue {
  id: string;
  location: string;
  fileName: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('locations');
  const [locations, setLocations] = useState<Location[]>([]);
   const [newLocation, setNewLocation] = useState({
    id: '',
    name: '',
    address: '',
    contacts: {
      whatsapp: '',
      telegram: '',
      email: '',
      phone: '',
    }
  });
  const [printQueue, setPrintQueue] = useState<PrintQueue[]>([]);
  const [analytics, setAnalytics] = useState({ totalLocations: 0, activeUploads: 0, filesPrinted: 0 });

  useEffect(() => {
    // Fetch locations
    const getLocations = async () => {
      try {
        const data = await fetchLocations();
        setLocations(data);
      } catch (error) {
        toast.error('Error fetching locations');
      }
    };

    // Fetch print queue
    const getPrintQueue = async () => {
      try {
        const data = await fetchPrintQueue();
        setPrintQueue(data.data);
      } catch (error) {
        toast.error('Error fetching print queue');
      }
    };

    // Fetch analytics data
    const getAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        setAnalytics(data.data);
      } catch (error) {
        toast.error('Error fetching analytics');
      }
    };

    getLocations();
    getPrintQueue();
    getAnalytics();
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.name || !newLocation.address) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const data = await addLocation(newLocation);
      setLocations([...locations, data]);
      setNewLocation({id:new Date().getTime().toString(), name: '', address: '',contacts: {whatsapp: '', telegram: '', email: '', phone: ''}});
      toast.success('Location added successfully');
    } catch (error) {
      toast.error('Error adding location');
    }
  };

  const handleDeleteLocation = async (id: (string | undefined)) => {
    try {
      await deleteLocation(id);
      setLocations(locations.filter((loc) => loc._id !== id));
      toast.success('Location deleted successfully');
    } catch (error) {
      toast.error('Error deleting location');
    }
  };

  const generateQRUrl = (id: (string | undefined)) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/upload/${id}`;
  };

  const downloadQR = (id:( string | undefined), locationName: string) => {
    const canvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `printeasy-${locationName.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = async (fileId: string) => {
    try {
      await printFile(fileId);
      toast.success('File sent to print');
      fetchPrintQueue(); // Re-fetch print queue after printing
    } catch (error) {
      toast.error('Error printing file');
    }
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
                    <label className="block text-sm font-medium text-gray-700">Location Name *</label>
                    <input
                      type="text"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Main Branch"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address *</label>
                    <input
                      type="text"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={newLocation.contacts.whatsapp}
                      onChange={(e) => setNewLocation({
                        ...newLocation,
                        contacts: { ...newLocation.contacts, whatsapp: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telegram Username</label>
                    <input
                      type="text"
                      value={newLocation.contacts.telegram}
                      onChange={(e) => setNewLocation({
                        ...newLocation,
                        contacts: { ...newLocation.contacts, telegram: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={newLocation.contacts.email}
                      onChange={(e) => setNewLocation({
                        ...newLocation,
                        contacts: { ...newLocation.contacts, email: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="branch@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={newLocation.contacts.phone}
                      onChange={(e) => setNewLocation({
                        ...newLocation,
                        contacts: { ...newLocation.contacts, phone: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="+1234567890"
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
                  <div key={location._id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
                        <p className="text-sm text-gray-500">{location.address}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteLocation(location._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      {location.contacts?.whatsapp && (
                        <a
                          href={`https://wa.me/${location.contacts?.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 hover:text-green-600"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </a>
                      )}
                      {location.contacts?.telegram && (
                        <a
                          href={`https://t.me/${location.contacts?.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Telegram
                        </a>
                      )}
                      {location.contacts?.email && (
                        <a
                          href={`mailto:${location.contacts?.email}`}
                          className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      )}
                      {location.contacts?.phone && (
                        <a
                          href={`tel:${location.contacts?.phone}`}
                          className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </a>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                      <QRCodeSVG
                        id={`qr-${location._id}`}
                        value={generateQRUrl(location._id)}
                        size={200}
                        level="H"
                        includeMargin
                      />
                      <button
                        onClick={() => downloadQR(location._id, location.name)}
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
                {printQueue.length === 0 ? (
                  <p>No files in the print queue</p>
                ) : (
                  <ul className="space-y-4">
                    {printQueue.map((file) => (
                      <li key={file.id} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{file.fileName}</h3>
                          <p className="text-sm text-gray-500">{file.location}</p>
                        </div>
                        <button
                          onClick={() => handlePrint(file.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Print
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">Total Locations</h3>
                  <p className="text-2xl font-bold text-blue-900">{analytics.totalLocations}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Active Uploads</h3>
                  <p className="text-2xl font-bold text-green-900">{analytics.activeUploads}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">Files Printed</h3>
                  <p className="text-2xl font-bold text-purple-900">{analytics.filesPrinted}</p>
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