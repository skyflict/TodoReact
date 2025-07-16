import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="loader-spinner"></div>
      <p>Загрузка...</p>
    </div>
  );
};
