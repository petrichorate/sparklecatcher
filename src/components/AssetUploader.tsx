
import { useState } from 'react';
import { GameAssets } from '@/hooks/useGameState';

interface AssetUploaderProps {
  onAssetsChange: (assets: Partial<GameAssets>) => void;
}

export const AssetUploader = ({ onAssetsChange }: AssetUploaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, assetKey: keyof GameAssets) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onAssetsChange({ [assetKey]: event.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 
                   transition-colors shadow-lg border border-white/20"
      >
        🎨
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 p-4 bg-white/10 
                      backdrop-blur-md rounded-lg shadow-lg border border-white/20
                      flex flex-col gap-3 min-w-[200px]">
          <div className="flex flex-col gap-2">
            {(Object.keys(DEFAULT_ASSETS) as Array<keyof GameAssets>).map((asset) => (
              <div key={asset} className="flex items-center gap-2">
                <label className="text-sm text-white/90 capitalize">
                  {asset.replace(/([A-Z])/g, ' $1').trim()}:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, asset)}
                  className="hidden"
                  id={`upload-${asset}`}
                />
                <label
                  htmlFor={`upload-${asset}`}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 transition-colors
                           rounded-full text-sm text-white cursor-pointer"
                >
                  Upload
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DEFAULT_ASSETS = {
  background: '/placeholder.svg',
  character: '/placeholder.svg',
  basket: '/placeholder.svg',
  raindrop: '/placeholder.svg',
  winScreen: '/placeholder.svg',
};
