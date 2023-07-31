import React from "react";
import "./ImagesGallery.scss";

const ImagesGallery = ({ preview, prefix, onClick }) => {
  return (
    <div className="images-gallery">
      {preview.map((item, index) => {
        return (
          <div className="images-gallery-column" key={index}>
            {" "}
            <img
              src={`${prefix}${item}`}
              width="200"
              alt={`image_ ${index + 1}`}
            />
            <p>image #{index + 1}</p>
            <button
              className="button-delete"
              onClick={() => {
                onClick(item);
              }}
            >
              X
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ImagesGallery;
