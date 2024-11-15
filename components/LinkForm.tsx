import { Fragment, FunctionComponent, useEffect, useState } from "react";
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
  isLinkEdit: boolean;
  isLinkFormOpen: boolean;
  closeLinkForm: () => void;
}

export const LinkForm: FunctionComponent<ILinkFormProps> = ({
  id,
  isLinkEdit,
  isLinkFormOpen,
  closeLinkForm,
}) => {
  const [formTitle, setFormTitle] = useState<string>("Create a New Link");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    id: undefined,
    url: "",
    slug: "",
    description: "",
    createdAt: undefined,
    totalUsage: 0,
  });

  useEffect(() => {
    if (isLinkEdit) {
      setFormTitle("Edit Link");
    }
  }, [isLinkEdit]);

  useEffect(() => {
    resetForm();
    setIsLoading(false);
  }, [isLinkFormOpen]);

  useEffect(() => {
    const carregarLink = async () => {
      const response = await fetch(`/api/links/${id}`);
      const json = await response.json();

      setFormData(json.data);
    };

    if (id === undefined) return;

    try {
      setIsLoading(true);

      carregarLink();
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      id: undefined,
      url: "",
      slug: "",
      description: "",
      createdAt: undefined,
      totalUsage: 0,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const method = isLinkEdit ? "PUT" : "POST";
      const url = isLinkEdit ? `/api/links/${id}` : "/api/links";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData, (k, v) => {
          return v === undefined ? null : v;
        }),
      });

      if (response.status === 400) {
        const json = await response.json();
        toast.error(json.errorMessage);
      } else {
        const sucessMessage = `Link ${
          isLinkEdit ? "edited" : "created"
        } successfully`;

        toast.success(sucessMessage);
        closeLinkForm();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={isLinkFormOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => closeLinkForm()}
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
                        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
                        autoComplete="off"
                        required
                      />
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
                        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
                        autoComplete="off"
                        required
                      />
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
                        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
                        autoComplete="off"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={isLoading}
                    >
                      {!isLoading && (
                        <span>{isLinkEdit ? "Update" : "Create"}</span>
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
