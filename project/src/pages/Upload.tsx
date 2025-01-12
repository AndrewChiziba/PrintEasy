import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, File, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Upload = () => {
  const { locationId } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    // TODO: Implement actual file upload with locationId
    console.log('Uploading files for location:', locationId);
    toast.success('Files uploaded successfully!');
    navigate('/success/123'); // Replace with actual file ID
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Your Files</h1>

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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Print Preferences
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue="color"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue="a4"
            >
              <option value="a4">A4</option>
              <option value="a3">A3</option>
              <option value="letter">Letter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Email (optional)
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload Files
        </button>
      </form>
    </div>
  );
};

export default Upload;