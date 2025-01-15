import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, File, X, MessageCircle, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { addUploadFile, fetchUploadFileById, fetchUploadFiles, fetchLocationById, fetchAnalytics } from '../services/api';

interface Location {
  id: string;
  name: string;
  address: string;
  contacts: {
    whatsapp?: string;
    telegram?: string;
    email?: string;
    phone?: string;
  };
  user?: string;
}

interface printPreferences {
  type: string;
  size: string;
}

interface UploadFile {
  id: string;
  name: string;
  binaryContents: ArrayBuffer;
  userId: string;
  locationId: string;
  queueId: string;
  printPreferences: printPreferences;
}

const Upload = () => {
  const { locationId } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [printPreferences, setPrintPreferences] = useState({
    type: 'color',
    size: 'a4'
  });
  const navigate = useNavigate();
  const userId = 'user123'; // Assuming the userId is static for now
  const queueId = crypto.randomUUID(); // Generating a unique queue ID

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  const removeFile = (name: string) => {
    setFiles(files.filter(file => file.name !== name));
  };

  // Fetch location details from the API
  const getLocation = async () => {
    try {
      const data = await fetchLocationById(locationId);
      console.log('data',data);
      setLocation(data);
    } catch (error) {
      toast.error('Error fetching location details');
    }
  };

  useEffect(() => {
    if (locationId) {
      getLocation();
    }
  }, [locationId]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (files.length === 0) {
        toast.error('Please select at least one file to print');
        return;
      }

      try {
        const promises = files.map(async file => {
          const arrayBuffer = await file.arrayBuffer();  // Get ArrayBuffer from the file
          console.log('arrayBuffer',arrayBuffer);

          // Convert ArrayBuffer to Uint8Array (this works in the browser)
          const binaryContents = new Uint8Array(arrayBuffer);
          console.log('binaryContents',binaryContents);
          const uploadFile: UploadFile = {
            id: crypto.randomUUID(),
            name: file.name,  
            binaryContents,
            userId: location?.user as string,
            locationId: locationId as string,
            printPreferences: { type:printPreferences.type, size:printPreferences.size},
            
            queueId,
          };
          console.log('binaryContents',binaryContents, 'uploadFile: ',uploadFile);
          await addUploadFile(uploadFile);
          console.log('uploadFile',uploadFile);
        });

        await Promise.all(promises);
        toast.success('Files added to the print queue');
        navigate('/success/' + queueId);
      } catch (error) {
        toast.error('Error adding files to the print queue');
      }
    };
  
  
  const openSocialLink = (type: string) => {
    if (!location) return;

    const message = encodeURIComponent(
      `Hello! I would like to print ${files.length} file(s)\n` +
      `Print preferences:\n` +
      `- Type: ${printPreferences.type}\n` +
      `- Size: ${printPreferences.size.toUpperCase()}`
    );

    let url = '';
    switch (type) {
      case 'whatsapp':
        url = `https://wa.me/${location.contacts.whatsapp}?text=${message}`;
        break;
      case 'telegram':
        url = `https://t.me/${location.contacts.telegram?.replace('@', '')}`;
        break;
      case 'email':
        url = `mailto:${location.contacts.email}?subject=Print Request&body=${message}`;
        break;
      case 'phone':
        url = `tel:${location.contacts.phone}`;
        break;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  if (!location) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading location details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{location.name}</h2>
        <p className="text-gray-600">{location.address}</p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <input {...getInputProps()} />
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, DOC, DOCX, PNG, JPG
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Selected Files
          </h2>
          <div className="space-y-2">
            {files.map(file => (
              <div
                key={file.name}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Print Preferences
            </label>
            <select
              value={printPreferences.type}
              onChange={(e) => setPrintPreferences({ ...printPreferences, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="color">Color</option>
              <option value="grayscale">Grayscale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paper Size
            </label>
            <select
              value={printPreferences.size}
              onChange={(e) => setPrintPreferences({ ...printPreferences, size: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="a4">A4</option>
              <option value="a3">A3</option>
              <option value="letter">Letter</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add to Print Queue
        </button>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Or contact us directly via:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {location.contacts.whatsapp && (
              <button
                type="button"
                onClick={() => openSocialLink('whatsapp')}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors"
              >
                <MessageCircle className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm text-gray-600">WhatsApp</span>
              </button>
            )}
            {location.contacts.telegram && (
              <button
                type="button"
                onClick={() => openSocialLink('telegram')}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <MessageCircle className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Telegram</span>
              </button>
            )}
            {location.contacts.email && (
              <button
                type="button"
                onClick={() => openSocialLink('email')}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <Mail className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Email</span>
              </button>
            )}
            {location.contacts.phone && (
              <button
                type="button"
                onClick={() => openSocialLink('phone')}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <Phone className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Call</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Upload;
