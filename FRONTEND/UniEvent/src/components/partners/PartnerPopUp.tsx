import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import imageIcon from "../../assets/image_icon.svg";
import TextInput from "../form/components/TextInput";
import { fieldContext } from "../form/context";
import { useCreatePartner, useUpdatePartner } from "../../api/partners";
import { getGoogleDriveDirectLink } from "../common/DriveImage";
import { useFaculty } from "../../context/FacultyContext";
import { useAuth } from "../../context/AuthContext";

type Props = {
  partnerId?: string;
  name: string;
  logo: string | null;
  onClose: () => void;
};

const isValidGoogleDriveUrl = (url: string): boolean => {
  if (!url) return false;
  return /drive\.google\.com|docs\.google\.com|lh[2-6]\.googleusercontent\.com/.test(url);
};

const PartnerPopUp = ({ partnerId, name, logo, onClose }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string>(logo ?? "");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<string>("");

  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const { state: facultyState } = useFaculty();
  const { user } = useAuth();

  // For super admins: use the faculty selected in the header (null when "UVT" = UVT-wide).
  // For dept admins: backend derives the department from their JWT; we send undefined.
  const departmentForCreate =
    user?.current_role === "super_administrator"
      ? (facultyState.currentFaculty === "UVT" ? null : facultyState.currentFaculty)
      : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    defaultValues: {
      name: name,
      logoUrl: logo ?? "",
    },
    onSubmit: async ({ value }) => {
      if (!isValidGoogleDriveUrl(value.logoUrl)) {
        setLogoError("Link-ul trebuie să fie un URL valid de Google Drive.");
        return;
      }
      setLogoError("");

      const payload = {
        name: value.name,
        logo_path: value.logoUrl || undefined,
      };

      if (partnerId) {
        await updatePartner.mutateAsync({ id: partnerId, ...payload });
      } else {
        await createPartner.mutateAsync({
          ...payload,
          department: departmentForCreate,
        });
      }

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <form.Field
                name="logoUrl"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                    {logoError && (
                      <p className="text-red-500 text-sm font-medium">{logoError}</p>
                    )}
                    {previewUrl ? (
                      <div className="flex justify-center border-2 border-dashed border-gray-200 rounded-lg p-2">
                        <img
                          src={getGoogleDriveDirectLink(previewUrl)}
                          alt="Preview"
                          className="h-24 object-contain"
                          onError={() => setPreviewUrl("")}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center border-2 border-dashed border-gray-200 rounded-lg px-6 py-6">
                        <img
                          src={imageIcon}
                          alt="Placeholder"
                          className="h-10 w-10 opacity-30"
                        />
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                type="button"
                onClick={onClose}
              >
                Anulează
              </button>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm cursor-pointer disabled:opacity-50"
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? "Se salvează..." : "Salvează"}
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
