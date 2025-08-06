import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';

const OCRUpload = ({ onTextExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const processImage = useCallback(async (file) => {
    setIsProcessing(true);
    setProgress(0);
    setError('');

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const extractedText = result.data.text.trim();
      
      if (extractedText) {
        onTextExtracted(extractedText);
      } else {
        setError('No text could be extracted from the image. Please try a clearer image.');
      }
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('OCR Error:', err);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [onTextExtracted]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      processImage(file);
    }
  }, [processImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900">Extract Text from Image</h3>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : isProcessing
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        
        {isProcessing ? (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-primary-100 rounded-full">
              <svg className="w-6 h-6 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Processing image...</p>
              <p className="text-xs text-gray-600">Extracting text using OCR</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isDragActive ? 'Drop your medical report here' : 'Upload medical report image'}
              </p>
              <p className="text-xs text-gray-600">
                Drag & drop or click to select • JPG, PNG, PDF supported
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>💡 <strong>Tip:</strong> For best results, ensure the image is clear and text is readable. Medical reports in PDF format are also supported.</p>
      </div>
    </div>
  );
};

export default OCRUpload; 