import React from "react";
import "./ImagesPreview.scss";

const ImagesPreview = ({ preview, onDeleteImage, prefix }) => {
  return (
    <div className="images-preview">
      {preview.map((item, index) => {
        return (
          <div key={index} className="images-preview-column">
            {" "}
            <img
              src={`${item.preview}`}
              width="200"
              alt={`image_ ${index + 1}`}
            />
            <p>image #{index + 1}</p>
            <button
              className="button-delete"
              onClick={() => {
                onDeleteImage(item);
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

export default ImagesPreview;
