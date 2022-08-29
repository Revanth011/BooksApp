import "./AddNotes.css"
import { db, storage } from "./firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Modal, Button, TextField } from '@material-ui/core';
import { useState, useRef } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

function AddNotes({ docu }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [topic, setTopic] = useState("")
    const [progress, setProgress] = useState(0);
    const fileRef = useRef(null);

    const addTopic = async () => {
        if (topic !== "") {
            const docRef = doc(db, "subjects", docu.id);
            const data = (await getDoc(docRef)).data();
            const topics = [...data.topics];
            topics.push({ topic: topic, url: "" })
            updateDoc(docRef, { topics })
            setTopic("")
        }
    }

    const deleteTopic = async (i) => {
        const docRef = doc(db, "subjects", docu.id);
        const data = (await getDoc(docRef)).data();
        let j = -1;
        const topics_ = data.topics.filter((d) => {
            j++;
            return i !== j;
        })
        updateDoc(docRef, { topics: topics_ })
    }

    function uploadFile(e, i) {
        e.preventDefault()
        const file = e.target.files[0];
        uploadFiles(file, i);
    }
    const uploadFiles = (file, i) => {
        if (!file) return;
        const sotrageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(sotrageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const docRef = doc(db, "subjects", docu.id);
                    const data = (await getDoc(docRef)).data();
                    const topics = [...data.topics];
                    topics[i].url = downloadURL
                    updateDoc(docRef, { topics })
                    setProgress(0)
                });
            }
        );
    };

    return (
        <>
            <Button variant="contained" size="small" onClick={handleOpen}>Add Notes</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="box">
                    <span>MY Notes</span>
                    <span>  {progress}%</span>
                    <div className="addTopics">
                        <div className="addTopicsTop">
                            <TextField id="standard-basic" label="Topic Name" variant="standard" size="small" margin="dense"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                            />
                            <Button variant="contained" color="primary" onClick={addTopic} >
                                Add Topic
                            </Button>
                        </div>
                        <div className="showNotes">
                            {
                                docu.topics.map((topic, i) => {
                                    return (
                                        <div className="showNotesContainer" key={i}>
                                            <span >{topic.topic}</span>
                                            <Button variant="contained" size="small" component="label">
                                                Add notes
                                                <input hidden multiple type="file" ref={fileRef} onChange={(e) => uploadFile(e, i)} />
                                            </Button>
                                            <Button variant="outlined" size="small" color="secondary" onClick={() => deleteTopic(i)} >
                                                Delete
                                            </Button>
                                            {topic.url !== "" && <a href={topic.url} target="_blank" rel="noreferrer">View File</a>}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AddNotes;