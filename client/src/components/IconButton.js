import { useDispatch, useSelector } from "react-redux";
import {
  setToolType,
  updateCanvasElementsArray,
} from "../redux/whiteboardSlice";
import { emitClearCanvasBox } from "../socketCon";

const IconButton = ({ src2, src, type, isRubber }) => {
  const dispatch = useDispatch();
  const { tool } = useSelector((store) => store.whiteboard);
  //console.log(tool);
  const setTypeOfFigure = () => {
    dispatch(setToolType(type));
    if (isRubber) {
      dispatch(updateCanvasElementsArray([]));
      emitClearCanvasBox();
    }
  };
  return (
    <button
      className={tool === type ? "menu_button active" : "menu_button"}
      onClick={setTypeOfFigure}
    >
      <img
        src={tool === type ? src2 : src}
        alt="button"
        width="80%"
        height="80%"
        fill="white"
      />
    </button>
  );
};

export default IconButton;
