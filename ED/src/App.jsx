// App.css 파일을 불러옵니다. 이 파일에는 우리 애플리케이션의 스타일(모양)이 정의되어 있습니다.
import "./App.css";

// React에서 제공하는 기능들을 불러옵니다.
// useRef: 고유한 값(예: 일기의 고유 번호)을 기억하기 위해 사용합니다.
// useReducer: 상태를 관리하기 위해 사용합니다.
// createContext: 데이터를 공유하기 위해 사용합니다.
import { useRef, useReducer, createContext } from "react";

// 페이지를 전환하기 위해 react-router-dom에서 제공하는 기능들을 불러옵니다.
import { Routes, Route } from "react-router-dom";

// 다른 컴포넌트들(각각의 페이지와 버튼, 헤더)을 불러옵니다.
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";
import Button from "./components/Button.jsx";
import Header from "./components/Header.jsx";

// 처음에 사용할 일기 데이터를 정의합니다.
const mockData = [
  {
    id: 1, // 일기의 고유 번호
    createdDate: new Date().getTime(), // 일기가 생성된 날짜와 시간
    emotionId: 1, // 일기에서 표현한 감정의 ID
    content: "1번 일기 내용", // 일기의 내용
  },
  {
    id: 2, // 일기의 고유 번호
    createdDate: new Date().getTime(), // 일기가 생성된 날짜와 시간
    emotionId: 2, // 일기에서 표현한 감정의 ID
    content: "2번 일기 내용", // 일기의 내용
  },
];

// 일기 데이터의 상태를 관리하는 함수입니다. 
// 이 함수는 'reducer'라고 불리며, 액션의 종류에 따라 상태를 업데이트합니다.
function reducer(state, action) {
  switch (action.type) {
    case "CREATE": // 새로운 일기를 추가할 때
      return [action.data, ...state]; // 새로운 일기를 현재 일기 목록 앞에 추가합니다.
    
      // 기존 일기를 수정할 때 사용하는 부분입니다.
    case "UPDATE":
      // state는 현재의 일기 목록입니다. state.map을 사용하여 모든 일기를 하나씩 확인합니다.
      return state.map((item) => 
        // 각 일기의 id가 수정할 일기의 id와 같은지 확인합니다.
        // item.id와 action.data.id를 문자열로 변환하여 비교합니다.
        String(item.id) === String(action.data.id) ? action.data : item
        // 만약 id가 같다면, 이 일기를 수정된 일기(action.data)로 바꿉니다.
        // id가 같지 않다면, 이 일기를 그대로 둡니다.
      );

    // 기존 일기를 삭제할 때 사용하는 부분입니다.
    case "DELETE":
      // state는 현재의 일기 목록입니다. state.filter를 사용하여 모든 일기를 하나씩 확인합니다.
      return state.filter((item) => 
        // 각 일기의 id가 삭제할 일기의 id와 다른지 확인합니다.
        // item.id와 action.id를 문자열로 변환하여 비교합니다.
        String(item.id) !== String(action.id)
      );

    // 그 외의 경우 (정의되지 않은 액션 타입이 들어올 때)
    default:
      // 현재 상태를 그대로 반환합니다. 아무 변화도 일어나지 않습니다.
      return state;
}

// 일기 데이터와 관련된 상태와 기능을 공유하기 위한 컨텍스트(Context)를 만듭니다.
const DiaryStateContext = createContext();
const DiaryDispatchContext = createContext();

// 우리의 메인 컴포넌트를 정의합니다. 애플리케이션의 모든 내용이 여기에 포함됩니다.
function App() {
  // useReducer 훅을 사용하여 상태를 관리합니다. 초기 상태는 mockData입니다.
  const [data, dispatch] = useReducer(reducer, mockData);

  // 일기의 고유 번호를 관리하기 위해 useRef를 사용합니다. 초기 값은 3입니다.
  const idRef = useRef(3);

  // 새로운 일기를 추가하는 함수입니다.
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: "CREATE", // 액션의 종류는 'CREATE'입니다.
      data: {
        id: idRef.current++, // 새로운 일기의 고유 번호를 설정하고 증가시킵니다.
        createdDate, // 일기가 생성된 날짜와 시간
        emotionId, // 일기에서 표현한 감정의 ID
        content, // 일기의 내용
      },
    });
  };

  // 기존 일기를 수정하는 함수입니다.
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE", // 액션의 종류는 'UPDATE'입니다.
      data: {
        id, // 수정할 일기의 고유 번호
        createdDate, // 수정된 날짜와 시간
        emotionId, // 수정된 감정의 ID
        content, // 수정된 일기의 내용
      },
    });
  };

  // 기존 일기를 삭제하는 함수입니다.
  const onDelete = (id) => {
    dispatch({
      type: "DELETE", // 액션의 종류는 'DELETE'입니다.
      id, // 삭제할 일기의 고유 번호
    });
  };

  // 우리의 애플리케이션 UI를 반환합니다.
  return (
    <>
      {/* 일기 추가 테스트 버튼입니다. 클릭하면 새로운 일기를 추가합니다. */}
      <button
        onClick={() => {
          onCreate(new Date().getTime(), 1, "Hello");
        }}
      >
        일기 추가 테스트
      </button>

      {/* 일기 수정 테스트 버튼입니다. 클릭하면 첫 번째 일기를 수정합니다. */}
      <button
        onClick={() => {
          onUpdate(1, new Date().getTime(), 3, "수정된 일기입니다.");
        }}
      >
        일기 수정 테스트
      </button>

      {/* 일기 삭제 테스트 버튼입니다. 클릭하면 첫 번째 일기를 삭제합니다. */}
      <button
        onClick={() => {
          onDelete(1);
        }}
      >
        일기 삭제 테스트
      </button>

      {/* 헤더 컴포넌트입니다. 제목과 왼쪽, 오른쪽 버튼을 포함합니다. */}
      <Header
        title={"이거슨제목"}
        leftChild={<Button text={"<"} />}
        rightChild={<Button text={">"} />}
      />

      {/* 일기 데이터와 관련된 상태와 기능을 자식 컴포넌트에 제공하기 위해 컨텍스트 프로바이더를 사용합니다. */}
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider
          value={{
            onCreate,
            onUpdate,
            onDelete,
          }}
        >
          {/* 애플리케이션의 각 페이지를 정의합니다. URL 경로에 따라 다른 페이지를 보여줍니다. */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/*" element={<Notfound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

// App 컴포넌트를 외부에서 사용할 수 있도록 내보냅니다.
export default App;
