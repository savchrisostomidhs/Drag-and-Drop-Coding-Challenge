import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import SortableItem from "./ListItem";
import "./DnDComponent.css";

type Item = { id: number; text: string; icon: string };

const DnDComponent = () => {
  //List of the items
  const [items, setItems] = useState<Item[]>(() => {
    const storedList = localStorage.getItem("codeList");
    const list = [
      { id: 1, text: "Eat", icon: "eat.svg" },
      { id: 2, text: "Sleep", icon: "sleep.svg" },
      { id: 3, text: "Code", icon: "code.svg" },
      { id: 4, text: "Repeat", icon: "repeat.svg" },
    ];
    try {
      return storedList ? JSON.parse(storedList) : list;
    } catch {
      return list;
    }
  });

  // Drag n Drop sensors for input
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  //Reorder list by id
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const getItemId = (id: string): number =>
      items.findIndex((item: Item) => item.id.toString() === id);

    if (active.id !== over.id) {
      setItems((items: Item[]) => {
        const oldIndex = getItemId(active.id.toString());
        const newIndex = getItemId(over.id.toString());

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  //Save list order whenever it changes
  useEffect(() => {
    localStorage.setItem("codeList", JSON.stringify(items));
  }, [items]);

  return (
    <div className="container">
      <p className="header">Drag and drop to reorder list</p>
      <div className="list">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item: Item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default DnDComponent;
