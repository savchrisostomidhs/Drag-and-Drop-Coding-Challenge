import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./ListItem.css";

const SortableItem = ({
  item,
}: {
  item: { id: number; text: string; icon: string };
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list-item"
    >
      <p className="item-id">{item.id}</p>
      <img src={item.icon} alt={item.text} className="icon" />
      <p>{item.text}</p>
    </div>
  );
};

export default SortableItem;
