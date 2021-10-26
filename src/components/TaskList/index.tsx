import React, { useCallback, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import 'antd/dist/antd.css';
import {
  AddIconDark,
  AddIconLight,
  AddItemContainer,
  AddItemTitle,
  Container,
  DescriptionContainer,
  EstimateContainer,
  ListBottomContainer,
  ListHeaderOutContainer,
  ListHeaderContainer,
  NumberContainer,
  PlannedContainer,
  Title,
  ListContainer,
  ListTitleContainer,
  CopyButtonContainer,
  CopyTitle,
  CopyButtonInnerContainer,
  CopyIcon,
  ListFinalBottomContainer,
  ConvertItemContainer,
  ConvertText,
  TagContainer, OtherTitle,
} from './styles';

import { Themes } from '../../styles/global';
import TaskListItem from '../TaskListItem';

interface TaskListProps {
  themeType: Themes;
  convert: boolean;
  squad:string;
}

export enum Planned {
  YES = 'Yes',
  NO = 'No'
}

export interface ListItem {
  tag:string;
  description: string;
  estimate: string;
  planned: Planned;
}

export interface HoverProp {
  isHover: boolean;
  index: number;
}

const TaskList: React.FC<TaskListProps> = ({ themeType, convert, squad }) => {
  const [taskList, setTaskList] = useState<Array<ListItem>>(() => {
    const localTaskList = localStorage.getItem('@taskList');
    if (localTaskList && localTaskList.length > 0) {
      return JSON.parse(localTaskList);
    }
    return [];
  });
  const [isHover, setHover] = useState<HoverProp>({ isHover: false, index: 0 });
  const [finalText, setFinalText] = useState('');

  useEffect(() => {
    let text = '';

    text += 'RESUMO,SQUAD,TIPO_SUBTASK,TIPO,COMPROMISSO,ITEM_ID,PARENT_ID,WIDGETS,PRIORIDADE \n';
    // eslint-disable-next-line @typescript-eslint/no-use-before-define,no-return-assign
    taskList.map((item, index) => text += `${getNextLine(item, index)}\n`);
    setFinalText(text);
  }, [convert]);

  useEffect(() => {
    localStorage.setItem('@taskList', JSON.stringify(taskList));
  }, [taskList]);

  const onPressAdd = useCallback(() => {
    setTaskList([...taskList, {
      tag: taskList.length > 0 && taskList[taskList.length - 1].tag ? taskList[taskList.length - 1].tag : '',
      description: '',
      estimate: taskList.length > 0 && taskList[taskList.length - 1].estimate ? taskList[taskList.length - 1].estimate : 'Parent ID',
      planned: Planned.YES,
    }]);
  }, [taskList]);

  const onPressDelete = (index: number) => {
    setHover({ isHover: false, index: 0 });
    setTaskList(taskList.filter((_, localIndex) => localIndex !== index));
  };

  const filterEstimate = (item: string) => {
    let hours = item.slice(0, 2);
    let minutes = item.slice(3, 5);

    if (hours[0] === '0') hours = item.slice(1, 2);
    if (minutes[0] === '0') minutes = item.slice(4, 5);

    if (minutes[0] === '0') return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const renderItem = (item: ListItem, index: number) => (
    <TaskListItem
      setTaskList={(_taskList) => setTaskList(_taskList)}
      index={index}
      onPressDelete={(_index) => onPressDelete(_index)}
      setHover={(_hover) => setHover(_hover)}
      isHover={isHover}
      themeType={themeType}
      taskList={taskList}
    />
  );

  const getNextLine = (item: ListItem, index: number) => (
    [`${item.tag ? `[${item.tag}]` : ''} ${item.description},${squad},DEV,Subtarefa,${item.planned === Planned.YES ? 'Não' : 'Sim'},${index + 1},${item.estimate},Nenhuma Alternativa,Trivial`]
  );

  return (
    <Container>
      {convert ? (
        <ListHeaderOutContainer>
          <ListHeaderContainer>
            <ListTitleContainer>
              <OtherTitle>List</OtherTitle>
            </ListTitleContainer>
            <CopyButtonContainer>
              <CopyButtonInnerContainer>
                <CopyIcon />
                <CopyTitle>
                  <CSVLink
                    onClick={() => console.log(finalText)}
                    filename="Subtasks.csv"
                    data={finalText}
                  >
                    Donwload
                  </CSVLink>
                </CopyTitle>
              </CopyButtonInnerContainer>
            </CopyButtonContainer>
          </ListHeaderContainer>
          <ConvertItemContainer>
            <ConvertText>
              {finalText}
            </ConvertText>
          </ConvertItemContainer>
          <ListFinalBottomContainer />
        </ListHeaderOutContainer>
      ) : (
        <>
          <ListHeaderOutContainer>
            <ListHeaderContainer>
              <NumberContainer />
              <TagContainer>
                <Title>Tag</Title>
              </TagContainer>
              <DescriptionContainer>
                <Title>Description</Title>
              </DescriptionContainer>
              <EstimateContainer>
                <Title>Parent ID</Title>
              </EstimateContainer>
              <PlannedContainer>
                <Title>Planned</Title>
              </PlannedContainer>
            </ListHeaderContainer>
          </ListHeaderOutContainer>
          <ListContainer>
            { taskList.length > 0 && (taskList.map((item, index) => renderItem(item, index)))}
          </ListContainer>
          <ListBottomContainer>
            <AddItemContainer onClick={onPressAdd}>
              {
                  themeType === Themes.LIGHT
                    ? <AddIconLight />
                    : <AddIconDark />
              }
              <AddItemTitle> New Task </AddItemTitle>
            </AddItemContainer>
          </ListBottomContainer>
        </>
      )}
    </Container>
  );
};

export default TaskList;
