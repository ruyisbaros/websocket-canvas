import { useDispatch, useSelector } from "react-redux";
import { setToolType } from "../redux/whiteboardSlice";

const IconButton = ({ src, type }) => {
  const dispatch = useDispatch();
  const { tool } = useSelector((store) => store.whiteboard);
  console.log(tool);
  const setTypeOfFigure = () => {
    dispatch(setToolType(type));
  };
  return (
    <button
      className={tool === type ? "menu_button active" : "menu_button"}
      onClick={setTypeOfFigure}
    >
      <img src={src} alt="button" width="80%" height="80%" />
    </button>
  );
};

export default IconButton;
