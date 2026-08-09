"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/shared/ui/dialog";
import { Button } from "@/src/shared/ui/button";
import { Slider } from "@/src/shared/ui/slider";
import { Label } from "@/src/shared/ui/label";
import { ZoomIn, ZoomOut, RotateCw, Crop } from "lucide-react";

export interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (croppedUrl: string, croppedBlob: Blob) => void;
  quality?: number;
  outputType?: "image/jpeg" | "image/png" | "image/webp" | "image/svg";
  title?: string;
}

async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
  outputType: string,
  quality: number,
): Promise<Blob> {
  const image = await createImageBitmap(
    await fetch(imageSrc).then((r) => r.blob()),
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  const bboxW = Math.floor(image.width * cos + image.height * sin);
  const bboxH = Math.floor(image.width * sin + image.height * cos);

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = bboxW;
  tempCanvas.height = bboxH;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.translate(bboxW / 2, bboxH / 2);
  tempCtx.rotate(radians);
  tempCtx.drawImage(image, -image.width / 2, -image.height / 2);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const offsetX = (bboxW - image.width) / 2;
  const offsetY = (bboxH - image.height) / 2;

  ctx.drawImage(
    tempCanvas,
    pixelCrop.x + offsetX,
    pixelCrop.y + offsetY,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      outputType,
      quality,
    );
  });
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  quality = 0.9,
  outputType = "image/jpeg",
  title = "Crop Image",
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedBlob(
        imageSrc,
        croppedAreaPixels,
        rotation,
        outputType,
        quality,
      );
      const url = URL.createObjectURL(blob);
      onCropComplete(url, blob);
      onOpenChange(false);
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Crop className="w-4 h-4" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Cropper canvas */}
        <div className="relative w-full" style={{ height: 400 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            cropSize={{ width: 350, height: 350 }}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            style={{
              containerStyle: { borderRadius: 0 },
              cropAreaStyle: {
                border: "2px solid white",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
              },
            }}
          />
        </div>

        {/* Controls */}
        <div className="px-6 py-5 flex flex-col gap-5 border-b bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-[80%] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-zinc-500">Zoom</Label>
                <span className="text-xs text-zinc-400 tabular">
                  {zoom.toFixed(1)}×
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ZoomOut className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <Slider
                  min={1}
                  max={3}
                  step={0.05}
                  value={[zoom]}
                  onValueChange={(value) => {
                    const zoomValue = Array.isArray(value) ? value[0] : value;
                    setZoom(zoomValue);
                  }}
                  className="flex-1"
                />
                <ZoomIn className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-zinc-500">Rotation</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-sm"
                onClick={() => setRotation((r) => (r + 90) % 360)}
              >
                <RotateCw className="w-3.5 h-3.5" />
                {rotation}°
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 flex-row justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isProcessing}
              onClick={handleConfirm}
              className="bg-zinc-900 hover:bg-zinc-700 text-white"
            >
              {isProcessing ? "Cropping…" : "Apply crop"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
