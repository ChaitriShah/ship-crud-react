import { useState, useEffect, useRef, Fragment } from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import ReadOnlyRow from './Components/ReadOnlyRow';
import EditableRow from './Components/EditableRow';
import './App.css';
import data from './mock-data.json';

function App() {
  const [details, setDetails] = useState(data);
  const baseUrl = 'http://localhost:3000/Ship/';
  const [addFormData, setFormData] = useState({
    name: '',
    length: '',
    width: '',
    code: ''
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    length: '',
    width: '',
    code: ''
  })

  const [editDetailId, setEditDetailId] = useState(null);

  const [isValidated, setIsValidated] = useState(true);

  const handleAddFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  };

  const isInitialMount = useRef(true);
  const codeInput = useRef(null);

  useEffect(() => {
    axios({
      method: 'get',
      url: baseUrl,
      responseType: 'stream'
    })
      .then((response) => {
        setDetails(response.data);
      });
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (document.activeElement === codeInput.current) {
        addFormData.code.match("[A-Z]{4}-[0-9]{4}-[A-Z][0-9]$") ? setIsValidated(true) : setIsValidated(false);
      }
    }
  });

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  }


  const handleAddFormSubmit = async (event) => {
    event.preventDefault();
    if (isValidated) {
      const newDetail = {
        id: uuidv4(),
        name: addFormData.name,
        length: addFormData.length,
        width: addFormData.width,
        code: addFormData.code
      }

      axios({
        method: 'post',
        url: baseUrl,
        data: newDetail
      }).then((response) => {
        setDetails(response.data);
      });

      setFormData({
        name: '',
        length: '',
        width: '',
        code: ''
      })
    }
  }

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedDetail = {
      id: editDetailId,
      name: editFormData.name,
      length: editFormData.length,
      width: editFormData.width,
      code: editFormData.code
    }

    axios({
      method: 'put',
      url: baseUrl + editDetailId,
      data: editedDetail
    }).then((response) => {
      setDetails(response.data);
    });
    setEditDetailId(null);
  }

  const handleEditClick = (event, detail) => {
    event.preventDefault();
    setEditDetailId(detail.id);

    const formValues = {
      name: detail.name,
      length: detail.length,
      width: detail.width,
      code: detail.code
    }

    setEditFormData(formValues);
  }

  const handleCancelClick = () => {
    setEditDetailId(null)
  }

  const handleDeleteClick = (detailId) => {
    axios.delete(baseUrl + detailId).then((response) => {
      setDetails(response.data);
    })
  }

  return (
    <div className="app-container">
      <h2 align="center">Ship Details</h2>
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Ship Name</th>
              <th>Length (m)</th>
              <th>Width (m)</th>
              <th>Ship Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail) => (
              <Fragment key={detail.id}>
                {editDetailId === detail.id ? (
                  <EditableRow editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange} handleCancelClick={handleCancelClick} />
                ) : (
                  <ReadOnlyRow detail={detail}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick} />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>

      <h2>Add a new Ship</h2>
      <form className="add-form" onSubmit={handleAddFormSubmit}>
        <table>
          <thead>
            <tr>
              <td>Name:</td>
              <td><input type="text" name="name" required="required" size="24" placeholder="Enter name" value={addFormData.name} onChange={handleAddFormChange} /></td>
            </tr>
            <tr>
              <td>Length:</td>
              <td>
                <input type="number" name="length" required="required" size="24" placeholder="Enter length in metres" value={addFormData.length} onChange={handleAddFormChange} />
              </td>
            </tr>
            <tr>
              <td>Width:</td>
              <td>
                <input type="number" name="width" required="required" size="30" placeholder="Enter width in metres" value={addFormData.width} onChange={handleAddFormChange} />
              </td>
            </tr>
            <tr>
              <td>Code:</td>
              <td>
                <input type="text" name="code" required="required" size="24" ref={codeInput} placeholder="Enter code e.g. XXXX-0000-X0" value={addFormData.code} onChange={handleAddFormChange} />
              </td>
            </tr>
          </thead>
        </table>
        {isValidated === false ? <span small="true" style={{ color: "red" }}>The Ship Code is invalid. Please enter in format XXXX-0000-X0. </span> : null}
        <br />
        <button className="add" type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;
