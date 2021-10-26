import React from 'react';
import {
  ItemDescriptionContainer,
  ItemDescriptionText,
  ItemEstimateContainer,
  ItemPlannedContainer,
  ItemPlannedText,
  ItemTagContainer,
  ItemTagText,
  TaskItemContainer,
  TaskItemNumberContainer,
  TaskItemNumberText,
  TrashIconDark,
  TrashIconLight,
} from './styles';

import { HoverProp, ListItem, Planned } from '../TaskList';
import { Themes } from '../../styles/global';

export interface ListItemProps {
    index: number,
    onPressDelete(index: number): void,
    setHover(item: HoverProp): void,
    isHover: HoverProp,
    themeType: Themes,
    taskList: Array<ListItem>,
    setTaskList(list: Array<ListItem>): void,
}

const TaskListItem: React.FC<ListItemProps> = ({
  index,
  onPressDelete,
  setHover,
  isHover,
  themeType,
  taskList,
  setTaskList,
}) => {
  const format = 'HH:mm';
  const renderTrash = () => (
    themeType === Themes.LIGHT ? <TrashIconLight /> : <TrashIconDark />
  );

  const onEditTag = (index2: number) => (e: any) => {
    const newArray = [...taskList];
    newArray[index2].tag = e.target.value;
    setTaskList(newArray);
  };

  const onEditEstimate = (index2: number) => (e: any) => {
    const newArray = [...taskList];
    newArray[index2].estimate = e.target.value;
    setTaskList(newArray);
  };

  const onEditDescription = (index2: number) => (e: any) => {
    const newArray = [...taskList];
    newArray[index2].description = e.target.value;
    setTaskList(newArray);
  };

  const onEditPlanned = (index2: number) => {
    const newArray = [...taskList];
    newArray[index2].planned = newArray[index2].planned === Planned.YES ? Planned.NO : Planned.YES;
    setTaskList(newArray);
  };

  return (
    <TaskItemContainer key={index}>
      <TaskItemNumberContainer
        onClick={() => onPressDelete(index)}
        onPointerOver={() => setHover({ isHover: true, index })}
        onPointerLeave={() => setHover({ isHover: false, index: 0 })}
      >
        {isHover.isHover && isHover.index === index
          ? (renderTrash()) : (
            <TaskItemNumberText>
              {index + 1}
            </TaskItemNumberText>
          )}
      </TaskItemNumberContainer>
      <ItemTagContainer>
        <ItemTagText
          value={taskList[index].tag}
          placeholder="Add Tag"
          onChange={onEditTag(index)}
        />
      </ItemTagContainer>
      <ItemDescriptionContainer>
        <ItemDescriptionText
          value={taskList[index].description}
          placeholder="Add Description"
          onChange={onEditDescription(index)}
        />
      </ItemDescriptionContainer>
      <ItemEstimateContainer>
        <ItemTagText
          value={taskList[index].estimate}
          placeholder="Parent ID"
          onChange={onEditEstimate(index)}
        />
      </ItemEstimateContainer>
      <ItemPlannedContainer>
        <ItemPlannedText onClick={() => onEditPlanned(index)}>
          {taskList[index].planned}
        </ItemPlannedText>
      </ItemPlannedContainer>
    </TaskItemContainer>
  );
};

export default TaskListItem;
