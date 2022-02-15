import React, { useRef, useEffect, useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from '@material-ui/icons/Cancel';

const EditableRow = ({ editFormData, handleEditFormChange, handleCancelClick, handleEditFormSubmit }) => {

    const [isEditCodeValidated, setEditCodeValidated] = useState(true);
    const [codeInputClass, setCodeInputClass] = useState("codeError");

    const isInitialMount = useRef(true);
    const editCodeInput = useRef(null);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (document.activeElement === editCodeInput.current) {
                if (editFormData.code.match("[A-Z]{4}-[0-9]{4}-[A-Z][0-9]$")) {
                    setEditCodeValidated(true);
                    setCodeInputClass("");
                }
                else {
                    setEditCodeValidated(false);
                    setCodeInputClass("codeError");
                }
            }
        }
    });

    return (
        <tr>
            <td>
                <input type="text" required="required" placeholder="Name" name="name"
                    value={editFormData.name} onChange={handleEditFormChange}></input>
            </td>
            <td>
                <input type="number" required="required" placeholder="Length" name="length"
                    value={editFormData.length} onChange={handleEditFormChange}></input>
            </td>
            <td>
                <input type="number" required="required" placeholder="Width" name="width"
                    value={editFormData.width} onChange={handleEditFormChange}></input>
            </td>
            <td>
                <input type="text" required="required" className={codeInputClass} ref={editCodeInput} placeholder="Code" name="code"
                    value={editFormData.code} onChange={handleEditFormChange}></input>
                {isEditCodeValidated === false ? <span small="true" style={{ color: "red" }}>Enter Ship code in  XXXX-0000-X0 format. </span> : null}
            </td>
            <td>
                {isEditCodeValidated ? <button onClick={handleEditFormSubmit}><SaveIcon color="primary" /></button> : <button type="button"><SaveIcon color="primary" /></button>} &nbsp;
                <button type="button" onClick={handleCancelClick}><CancelIcon color="primary" /></button>
            </td>
        </tr>
    )
}

export default EditableRow