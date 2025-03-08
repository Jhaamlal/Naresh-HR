import React from "react"

interface AlertProps {
  type: "success" | "error" | "warning" | "info"
  message: string
  onClose?: () => void
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const typeClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  }

  return (
    <div
      className={`${typeClasses[type]} p-4 rounded-md border mb-4 flex justify-between items-center`}
    >
      <p>{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      )}
    </div>
  )
}

export default Alert
