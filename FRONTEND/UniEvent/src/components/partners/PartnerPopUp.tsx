import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import imageIcon from "../../assets/image_icon.svg";
import TextInput from "../form/components/TextInput";
import { fieldContext } from "../form/context";

type Props = {
  name: string;
  logo: string;
  onClose: () => void;
};

const PartnerPopUp = ({ name, logo, onClose }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string>(logo);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // TanStack Form
  const form = useForm({
    defaultValues: {
      name: name,
      logoFile: null as File | null,
    },
    onSubmit: async ({ value }) => {
      console.log("Testing Save Data:", {
        name: value.name,
        fileToUpload: value.logoFile,
      });

      // TODO:API call

      onClose();
    },
  });

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isMounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ease-out ${
            isMounted
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-0 opacity-0 translate-y-10"
          }`}
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {/* Field Nume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nume
              </label>
              <div>
                <form.Field
                  name="name"
                  children={(field) => (
                    <fieldContext.Provider value={field}>
                      <TextInput
                        label=""
                        placeholder="Introdu numele partenerului..."
                      />
                    </fieldContext.Provider>
                  )}
                />
              </div>
            </div>

            {/* Field Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>

              <form.Field
                name="logoFile"
                children={(field) => (
                  <div
                    className={`relative mt-1 flex justify-center border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors group cursor-pointer overflow-hidden ${
                      previewUrl ? "p-2" : "px-6 pt-5 pb-6"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.handleChange(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
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
                        <span className="relative rounded-md font-medium text-primary group-hover:text-primary">
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
                )}
              />
            </div>

            {/* Butoane */}
            <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors font-medium shadow-sm cursor-pointer disabled:opacity-50"
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                )}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PartnerPopUp;
