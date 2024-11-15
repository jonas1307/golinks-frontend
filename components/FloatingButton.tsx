import { FunctionComponent } from "react";
import { IconType } from "react-icons";

interface IFloatingButtonProps {
  Icon: IconType;
  action: () => void;
}

export const FloatingButton: FunctionComponent<IFloatingButtonProps> = ({
  Icon,
  action,
}) => {
  return (
    <div className="fixed bottom-12 right-12">
      <button
        className="flex justify-center items-center text-4xl w-16 h-16 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75"
        onClick={action}
      >
        {<Icon />}
      </button>
    </div>
  );
};
