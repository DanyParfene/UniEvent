import { useState } from "react";
import imageIcon from "../../assets/image_icon.svg";

type Props = {
  name: string;
  logo: string;
  setIsPartnerFormActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const PartnerPopUp = ({ name, logo, setIsPartnerFormActive }: Props) => {
  const [inputName, setInputName] = useState<string>(name);
  const [inputLogo, setInputLogo] = useState<string>(logo);
  const [previewUrl, setPreviewUrl] = useState<string>(logo);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Luăm primul fișier selectat

    if (file) {
      // Creăm un link temporar local pe care browserul îl poate citi
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <form className="flex flex-col gap-4" onSubmit={(e) => {e.preventDefault(); console.log("Testing")}}>
            {/* Field Nume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nume
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#033A89] outline-none transition-all"
              />
            </div>

            {/* Field Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <div
                className={`relative mt-1 flex justify-center border-2 border-gray-300 border-dashed rounded-lg hover:border-[#033A89] transition-colors group cursor-pointer overflow-hidden ${previewUrl ? "p-2" : "px-6 pt-5 pb-6"}`}
              >
                {/* Input-ul rceal este ascuns, dar ocupă toată cutia */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title=""
                />

                <div className="text-center flex flex-col items-center w-full">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-40 object-contain mb-2 rounded"
                    />
                  ) : (
                    <img
                      src={imageIcon}
                      alt="Image"
                      className="mx-auto h-12 w-12 opacity-50 group-hover:opacity-100 transition-all mb-2"
                    />
                  )}

                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="relative rounded-md font-medium text-[#033A89] group-hover:text-[#022860]">
                      {previewUrl
                        ? "Schimbă imaginea"
                        : "Alege un fișier din calculator"}
                    </span>
                  </div>
                  {!previewUrl && (
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      PNG, JPG, JPEG, SVG
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Butoane */}
            <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                type="button"
                onClick={() => {setIsPartnerFormActive(false)}}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#033A89] text-white rounded-lg hover:bg-[#022860] transition-colors font-medium shadow-sm cursor-pointer"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PartnerPopUp;
