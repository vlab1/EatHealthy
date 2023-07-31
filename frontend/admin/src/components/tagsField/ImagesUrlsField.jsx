import { useRecordContext } from "react-admin";


const ImagesUrlsField = () => {
  const obj = useRecordContext();
  return (
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gridGap: "10px"}}>
      {obj.images.map((item) => {
        return item && (<img crossorigin="anonymous"
          style={{ width: "100px", height: "100px" }}
          src={`http://localhost:5000/images/${item.split('_')[3].split('.')[0]}/${item}`}
          alt={`http://localhost:5000/images/${item.split('_')[3].split('.')[0]}/${item}`}
          key={item}
        />);
      })}
    </div>
  );
};

export default ImagesUrlsField;
