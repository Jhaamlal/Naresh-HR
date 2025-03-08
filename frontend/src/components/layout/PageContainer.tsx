import React, { ReactNode } from "react"

interface PageContainerProps {
  title: string
  children: ReactNode
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
      {children}
    </div>
  )
}

export default PageContainer
