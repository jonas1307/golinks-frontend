import React, { Fragment, FunctionComponent, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

interface ILinkFormProps {
  id?: string;
  isEditMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const LinkForm: FunctionComponent<ILinkFormProps> = ({
  id,
  isEditMode,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formTitle, setFormTitle] = useState<string>("Create a New Link");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{
    url?: string;
    slug?: string;
    description?: string;
    expiresAt?: string;
    general?: string;
  }>({});
  const [formData, setFormData] = useState({
    id: undefined,
    url: "",
    slug: "",
    description: "",
    expiresAt: "",
    createdAt: undefined,
    totalUsage: 0,
  });

  useEffect(() => {
    setFormTitle(isEditMode ? "Edit Link" : "Create a New Link");
  }, [isEditMode]);

  useEffect(() => {
    resetForm();
    setFormErrors({});
    setIsLoading(false);
  }, [isOpen]);

  useEffect(() => {
    if (id === undefined) return;

    const loadLink = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/links/${id}`);
        const json = await response.json();
        setFormData({
          ...json,
          expiresAt: json.expiresAt ? json.expiresAt.slice(0, 16) : "",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLink();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const resetForm = () => {
    setFormData({
      id: undefined,
      url: "",
      slug: "",
      description: "",
      expiresAt: "",
      createdAt: undefined,
      totalUsage: 0,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode ? `/api/links/${id}` : "/api/links";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: formData.url,
          slug: formData.slug,
          description: formData.description,
          expiresAt: formData.expiresAt
            ? new Date(formData.expiresAt + "Z").toISOString()
            : null,
        }),
      });

      if (!response.ok) {
        const json = await response.json();
        if (json.errors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, messages] of Object.entries(json.errors)) {
            const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
            fieldErrors[camelKey] = (messages as string[])[0];
          }
          setFormErrors(fieldErrors);
        } else {
          setFormErrors({ general: json.detail ?? "An unexpected error occurred." });
        }
      } else {
        toast.success(`Link ${isEditMode ? "edited" : "created"} successfully`);
        onSave();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={onClose}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {formTitle}
                  </DialogTitle>
                  {formErrors.general && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.general}</p>
                  )}
                  <form
                    onSubmit={handleSubmit}
                    className="max-w-lg mx-auto p-6 rounded-lg space-y-4"
                  >
                    <input
                      type="hidden"
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                    />

                    <div className="flex flex-col">
                      <label
                        htmlFor="url"
                        className="text-sm font-medium text-gray-700"
                      >
                        URL
                      </label>
                      <input
                        type="url"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        className={`mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 ${formErrors.url ? "border-red-500" : "border-gray-300"}`}
                        autoComplete="off"
                        required
                      />
                      {formErrors.url && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.url}</p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="slug"
                        className="text-sm font-medium text-gray-700"
                      >
                        Slug
                      </label>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className={`mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 ${formErrors.slug ? "border-red-500" : "border-gray-300"}`}
                        autoComplete="off"
                        required
                      />
                      {formErrors.slug && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.slug}</p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 ${formErrors.description ? "border-red-500" : "border-gray-300"}`}
                        autoComplete="off"
                        required
                      />
                      {formErrors.description && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="expiresAt"
                        className="text-sm font-medium text-gray-700"
                      >
                        Expires At <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="datetime-local"
                        id="expiresAt"
                        name="expiresAt"
                        value={formData.expiresAt}
                        onChange={handleChange}
                        className={`mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 ${formErrors.expiresAt ? "border-red-500" : "border-gray-300"}`}
                      />
                      {formErrors.expiresAt && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.expiresAt}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={isLoading}
                    >
                      {!isLoading && (
                        <span>{isEditMode ? "Update" : "Create"}</span>
                      )}
                      {isLoading && <BeatLoader color="#ffffff" size={10} />}
                    </button>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
