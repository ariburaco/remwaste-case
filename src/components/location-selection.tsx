'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOrder } from '@/lib/context';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Clock,
  Home,
  InfoIcon,
  Truck,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const locationOptions = [
  {
    id: 'private',
    title: 'Private Property',
    description: 'Driveway or private land',
    icon: <Home className="text-primary" size={30} />,
    requiresPermit: false,
    info: 'No permit required when placed on your private property',
  },
  {
    id: 'public',
    title: 'Public Road',
    description: 'Street or public highway',
    icon: <Truck className="text-primary" size={30} />,
    requiresPermit: true,
    info: 'Permit required for placement on public roads',
  },
];

export function LocationSelection() {
  const { state, prevStep, nextStep, setSkipLocation, setSkipPhoto } =
    useOrder();
  const [selectedLocation, setSelectedLocation] = useState<string>(
    state.skipLocation || 'private'
  );
  const [permitInfo, setPermitInfo] = useState<{
    required: boolean;
    fee?: number;
  }>({
    required: selectedLocation === 'public',
    fee: 84.0,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set up dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setPhoto(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB max size
    onDropRejected: (fileRejections) => {
      if (fileRejections[0]?.errors[0]?.code === 'file-too-large') {
        setError('Image is too large (max 10MB)');
      } else {
        setError('Please upload a valid image file (JPG, PNG)');
      }
    },
  });

  // Handle location change
  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    setPermitInfo({
      required: locationId === 'public',
      fee: 84.0,
    });
  };

  // Remove photo
  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Handle next step
  const handleContinue = () => {
    if (!photo) {
      setError('Please upload a photo of the skip location');
      return;
    }

    // Save to context
    setSkipLocation(selectedLocation);
    setSkipPhoto(photo);
    nextStep();
  };

  // Camera handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(
        'Could not access camera. Please check permissions or try uploading an image instead.'
      );
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'skip-location.jpg', {
            type: 'image/jpeg',
          });
          setPhoto(file);
          setPhotoPreview(canvas.toDataURL('image/jpeg'));
          stopCamera();
        }
      },
      'image/jpeg',
      0.95
    );
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
    setIsCameraActive(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center md:text-left text-foreground">
          Where will the skip be placed?
        </h1>
        <p className="text-muted-foreground mt-2 text-center md:text-left">
          This helps us determine if you need a permit for your skip
        </p>
      </header>

      {/* Location selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {locationOptions.map((option) => (
          <Card
            key={option.id}
            className={cn(
              'relative overflow-hidden cursor-pointer border-2 p-6',
              selectedLocation === option.id
                ? 'border-primary shadow-lg shadow-primary/20'
                : 'border-border hover:border-muted-foreground/50'
            )}
            onClick={() => handleLocationChange(option.id)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">
                  {option.title}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {option.description}
                </p>
                <p className="text-sm mt-4 text-foreground/90">{option.info}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Permit information */}
      <AnimatePresence>
        {permitInfo.required && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-amber-950/20 border border-amber-600/30 rounded-lg p-5 text-amber-500">
              <div className="flex items-start gap-3">
                <InfoIcon className="mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-amber-500">Permit Required</h4>
                  <p className="text-amber-400/90 mt-1">
                    A permit is required when placing a skip on a public road.
                    We'll handle the permit application process for you. An
                    additional fee of £{permitInfo.fee?.toFixed(2)} will be
                    added to your order.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary-foreground border border-border rounded-lg p-5 mt-4">
              <div className="flex items-start gap-3">
                <Clock className="text-primary mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-foreground">Processing Time</h4>
                  <p className="text-muted-foreground mt-1">
                    The council requires 5 working days notice to process permit
                    applications. Please plan your delivery date accordingly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo upload section */}
      <div className="border border-border rounded-lg overflow-hidden mb-8">
        <div className="bg-card p-5 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">
            Skip Placement Photo
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Please provide a photo of where you plan to place the skip. This
            helps us ensure proper placement and identify any potential access
            issues.
          </p>
        </div>

        <div className="p-6 bg-background">
          {photoPreview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-md overflow-hidden"
            >
              <img
                src={photoPreview}
                alt="Skip location"
                className="w-full h-64 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3"
                onClick={removePhoto}
              >
                <X size={20} />
              </Button>
            </motion.div>
          ) : isCameraActive ? (
            <div className="relative h-64 bg-black rounded-md overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-black/50">
                <Button
                  variant="default"
                  className="mr-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={takePhoto}
                >
                  <Camera size={18} className="mr-2" /> Take Photo
                </Button>
                <Button
                  variant="outline"
                  className="bg-background/80 hover:bg-background"
                  onClick={stopCamera}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-md h-64 flex flex-col items-center justify-center cursor-pointer p-4',
                isDragActive ? 'border-primary bg-primary/5' : 'border-border',
                error ? 'border-destructive' : ''
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload size={30} className="text-primary" />
                </div>
                <p className="text-foreground font-medium">
                  {isDragActive
                    ? 'Drop the image here'
                    : 'Drag and drop an image here'}
                </p>
                <p className="text-muted-foreground text-sm mt-1 mb-3">
                  or click to browse files
                </p>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                  >
                    <Camera size={18} /> Take Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border flex items-center gap-2"
                  >
                    <Upload size={18} /> Upload Photo
                  </Button>
                </div>
                {error && (
                  <p className="text-destructive text-sm mt-2">{error}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="max-md:fixed w-full max-md:bottom-0 max-md:border-t flex justify-between max-md:gap-4 max-md:p-4 max-md:left-0 max-md:right-0 max-md:z-10 max-md:bg-background max-md:shadow-sm">
        <Button
          onClick={prevStep}
          variant="outline"
          className="border-border hover:bg-accent"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Continue <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
