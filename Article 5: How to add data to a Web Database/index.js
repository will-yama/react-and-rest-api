import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const getRecordsEndpoint = "http://localhost:5000/getData";
const addRecordEndpoint = "http://localhost:5000/postData";

const callRestApi = async () => {
  const response = await fetch(getRecordsEndpoint);
  const jsonResponse = await response.json();
  console.log(jsonResponse);
  const ArrayOfLists = jsonResponse.records.map(
    record => <li key={record.recordID.value}><b>{record.title.value}</b> written by {record.author.value}</li>
  )
  return ArrayOfLists;
};

const AddNewRecord = async (Title, Author) => {
  const RecordBodyParameters = {
    'title': Title,
    'author': Author
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(RecordBodyParameters)
  }

  const response = await fetch(addRecordEndpoint, options);
  const jsonResponse = await response.json();
  console.log(JSON.stringify(jsonResponse));
  return jsonResponse;
};

function RenderResult() {
  const [apiResponse, setApiResponse] = useState("*** now loading ***");
  const [titleValue, setTitleValue] = useState("");
  const [authorValue, setAuthorValue] = useState("");
  const [successCounter, setSuccessCounter] = useState(0);

  useEffect(() => {
    callRestApi().then(
      result => setApiResponse(result));
  }, [successCounter]);

  function HandleTitleChange(event) {
    setTitleValue(event.target.value);
  }

  function HandleAuthorChange(event) {
    setAuthorValue(event.target.value);
  }

  function ButtonClick() {
    setApiResponse(apiResponse.concat(<li key="0" >*** now loading ***</li>));
    AddNewRecord(titleValue, authorValue)
      .then(response => {
          setSuccessCounter(successCounter + 1);
        }
      );
  }

  return (
    <div>
      <h1>React App</h1>
      <ul>{apiResponse}</ul>
      <form>
        <div>
          <label htmlFor="title-input">Title:</label>
          <input type="text" value={titleValue} id="title-input" onChange={HandleTitleChange} />
        </div>
        <div>
          <label htmlFor="author-input">Author:</label>
          <input type="text" value={authorValue} id="author-input" onChange={HandleAuthorChange} />
        </div>
        <button type="button" onClick={ButtonClick}>Add data</button>

      </form>
    </div>
  );
};

ReactDOM.render(
  <RenderResult />,
  document.querySelector('#root')
);
