import "./App.css"
import { db } from "./firebase"
import { collection, onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore";
import { Button, TextField } from '@material-ui/core';
import { useEffect, useState } from "react";
import AddNotes from "./AddNotes";

const subjCollcRef = collection(db, "subjects");

function App() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    subname: "",
    topics: []
  });

  useEffect(() => {
    onSnapshot(subjCollcRef, snapshot => {
      setSubjects(
        snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() }
        })
      )
    })
  }, []);

  function addSubject(e) {
    e.preventDefault();
    if (form.subname !== "") addDoc(subjCollcRef, form)
    form.subname = "";
  }

  function deleteSubject(id) {
    deleteDoc(doc(db, "subjects", id))
  }

  return (
    <div className="App">
      <div className="appContainer">
        <div className="appAdd">
          <TextField id="standard-basic" label="Subject Name" variant="standard" size="small" margin="dense"
            value={form.subname}
            onChange={e => setForm({ ...form, subname: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={addSubject} >
            Add Subject
          </Button>
        </div>
        <div className="appSubj">
          {subjects.map((docu, i) =>
            <div key={i} className="appSubjContainer">
              <span>{docu.subname}</span>
              <AddNotes docu={docu} />
              <Button variant="contained" color="secondary" onClick={() => deleteSubject(docu.id)} >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;