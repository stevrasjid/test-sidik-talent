import { useEffect, useMemo, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [notes, setNotes] = useState([])
  const [notesTemp, setNotesTemp] = useState([])
 

  const headers = useMemo(() => [
    {
      name: "Title",
      className:"width-30"
    },
    {
      name: "Description",
      className:"width-45"
    },
    {
      name: "Action",
      className: "width-25"
    }
  ])
  
  const NewNote = () => {
    let newNote = {
      id: 0,
      title: "",
      description: "",
      isEdit: true
    }

    setNotes([...notes, newNote])
  }

  const EditOrNewToggle = (note, isEdit) => {
    if (note.id == 0) {
      let notesDelete = notes.filter((x) => x != note);
      setNotes(notesDelete);
    }
    else {
      if(isEdit) {
        setNotesTemp([...notesTemp, note]);
        setNotes((prevState) => 
          prevState.map((item) => 
            item === note ? {...item, isEdit: isEdit} : item
          )
        )
      }
      else {
        let oldNote = notesTemp.find((x) => x.id == note.id);
        setNotes((prevState) => 
          prevState.map((item) =>
            item.id == note.id ? {...oldNote} : item
          )
        );
        let notesTempFilter = notesTemp.filter((x) => x.id !== note.id);
        setNotesTemp(notesTempFilter);
      }
    }
   
  }

  const SubmitNote = async (e, note) => {
    e.preventDefault();
    try {
      let response;
      if (note.id != 0) {
        response = await axios.put(
          "http://localhost:5050/api/notes", note,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      else {
        response = await axios.post(
          "http://localhost:5050/api/notes", note,
          {
            headers: { "Content-Type": "application/json", },
          }
        );
      }

      if (response.status === 200) {
        if (note.id != 0) {
          let notesTempFilter = notesTemp.filter((x) => x.id !== note.id);
          setNotesTemp(notesTempFilter);
        }
        console.log("Data has been successfully save");
        GetNotes();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const HandleChanges = (e, note) => {
    const target = e.target;
    const name = target.name;

    setNotes((prevState) => 
      prevState.map((item) => 
        item === note ? {...item, [name]: target.value} : item
      )
    )
  }

  const GetNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5050/api/notes",
        {
          headers: { "Content-Type": "application/json", },
        }
      );

      if (response.data.data) {
        setNotes(response.data.data)
      }
    } catch (err) {
      console.error(err);
    }
  }

  const DeleteNote = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:5050/api/notes/"+ id,
        {
          headers: { "Content-Type": "application/json", },
        }
      );

      if (response.status === 200) {
        console.log("Data has been successfully delete");
        GetNotes();
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    GetNotes();
  }, [])

  return (
    <>
     <section className="container">
      <div className="row">
        <h2 className='width-50'>Notes</h2>
      </div>
      <div className="row">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                {headers.map((value, key) => {
                  return (
                    <th
                      key={key}
                      className={value.className ? value.className : ""}
                    >
                      {value.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {notes.map((data, key) => {
                return (
                  <tr key={key}>
                    <td>
                      {data.isEdit ? <input className='form-control' name="title" value={data.title} onChange={(e) => HandleChanges(e, data)} /> : <>{data.title}</>}
                    </td>
                    <td>
                      {data.isEdit ? <textarea className='form-control' name="description" value={data.description} onChange={(e) => HandleChanges(e, data)} /> : <>{data.description}</>}
                    </td>
                    <td className="text-center">
                      {data.isEdit ? 
                      <>
                        <button
                        className="button-primary me-3"
                        onClick={(e) => SubmitNote(e, data)}
                      >
                        Submit
                      </button>
                      <button
                        className="button-delete"
                        onClick={() => EditOrNewToggle(data, false, key)}
                        >
                        Cancel
                      </button>
                      </>
                      :
                      notes.every((x) => !x.isEdit) ? 
                      <>
                        <button
                        className="button-primary me-3"
                        onClick={() => EditOrNewToggle(data, true, key)}
                      >
                        Edit
                      </button>
                      <button
                        className="button-delete"
                        onClick={() => DeleteNote(data.id)}
                      >
                        Delete
                      </button>
                      </>
                      : <></>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              {notes.every((x) => !x.isEdit) && 
                <tr>
                  <td colSpan={4}>
                    <button className="button-primary" onClick={NewNote}>
                      Add Note
                    </button>
                  </td>
                </tr>
              }
            </tfoot>
          </table>
        </div>
      </div>
    </section>
    </>
  )
}

export default App
