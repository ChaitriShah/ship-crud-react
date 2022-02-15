import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const ReadOnlyRow = ({ detail, handleEditClick, handleDeleteClick }) => {
    return (
        <tr>
            <td>{detail.name}</td>
            <td>{detail.length}</td>
            <td>{detail.width}</td>
            <td>{detail.code}</td>
            <td>
                <button type="button" onClick={(event) => handleEditClick(event, detail)}><EditIcon color="primary" /></button> &nbsp;
                <button type="buton" onClick={() => handleDeleteClick(detail.id)} ><DeleteIcon color="secondary" /></button>
            </td>
        </tr>
    )
}

export default ReadOnlyRow