// components/ServicePopup.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ServicePopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export default function ServicePopup({
  open,
  onClose,
  title,
  description,
}: ServicePopupProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <Dialog.Title className="text-2xl font-bold text-[#2563EB] mb-4">
                {title}
              </Dialog.Title>
              <p className="text-gray-700 mb-6">{description}</p>
              <button
                onClick={onClose}
                className="w-full bg-[#2563EB] text-white py-2 rounded hover:bg-black transition"
              >
                Close
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
